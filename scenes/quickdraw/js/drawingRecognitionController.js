/*
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
'use strict';

goog.provide('app.DrawingRecognitionController');
goog.require('app.EventEmitter');
goog.require('app.HandwritingAPI');
goog.require('app.config');


app.DrawingRecognitionController = function() {
  app.EventEmitter.call(this);
  this.handwritingAPI = new app.HandwritingAPI();
  this.processDrawingThrottle = throttle(
    function(drawing) {
      this.processDrawing(drawing)
    }.bind(this),
    app.config.max_api_rate * 1000
  );
};


app.DrawingRecognitionController.prototype = Object.create(app.EventEmitter.prototype);


app.DrawingRecognitionController.prototype.onDrawingUpdated = function(drawing) {
  this.processDrawingThrottle(drawing);
};


app.DrawingRecognitionController.prototype.processDrawing = function(drawing) {
  var segments = drawing.getSegments();
  var length = segments.reduce(function(memo, s) {
    return memo + s[0].length;
  }, 0);

  if (length > 10) {
    this.handwritingAPI.processSegments(segments, drawing.canvas.width, drawing.canvas.height);
  }
};
