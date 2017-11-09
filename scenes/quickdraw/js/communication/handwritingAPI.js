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

goog.provide('app.HandwritingAPI');
goog.require('app.config');


app.HandwritingAPI = function() {
};


app.HandwritingAPI.prototype.processSegments = function(segments, width, height) {
  return this.sendRequest(segments, {width: width, height: height});
};


app.HandwritingAPI.prototype.sendRequest = function(segments, options) {
  var request = {
    input_type: 0,
    requests: [{
      language: 'quickdraw'
    }]
  };

  if (options.width) {
    request.requests[0].writing_guide = {
      width: options.width,
      height: options.height
    }
  }

  if (segments) {
    request.requests[0].ink = segments;
  }

  $.post({
    url: app.config.handwriting_url,
    data: JSON.stringify(request),
    contentType: 'application/json'
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
      console.error(jqXHR, textStatus, errorThrown);
      reject("Could not call classifier");
  })
  .done(function(data) {
    if(data[0] == "SUCCESS") {
      console.log(this.parseResponse(data));
    } else {
        reject("Could not process classifier response");
    }
  }.bind(this));
};


app.HandwritingAPI.prototype.parseResponse = function(data) {
  var json = JSON.parse(data[1][0][3]["debug_info"].match(/SCORESINKS: (.+) Combiner:/)[1]);

  return json.map(function(s) {
    return {
        word: s[0],
        score: s[1],
        id: data[1][0][0],
        neighbor: s[2]
    }
  });
};
