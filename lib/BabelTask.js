// Copyright 2017, Venkat Peri.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

const { SourceSetTask } = require( 'hutt' );
const pify = require( 'pify' );
const transformFile = pify( require( 'babel-core' ).transformFile );
const arrayp = require( 'arrayp' );
const write = require( 'write' );

class BabelTask extends SourceSetTask {
  constructor( name, opts = {} ) {
    opts.sourceSetName = 'js'
    super( name, opts );
    this._babelOpts = opts.babelOpts || {};
  }

  transform( files ) {
    return Promise.all(
      files.map( file =>
        arrayp.chain( [
          () => Promise.all( [
            transformFile( file, this._babelOpts ),
            this.outputFileName( file ),
          ] ),
          ( [data, outName] ) =>
            Promise.all( [
              write( outName, data.code ),
              write( `${outName}.map`, data.map ),
            ] ),
        ] ) ) )
  }
}

module.exports = BabelTask;
