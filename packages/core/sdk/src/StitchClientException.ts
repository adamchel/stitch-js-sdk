/**
 * Copyright 2018-present MongoDB, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { StitchClientErrorCode } from "./StitchClientErrorCode";
import StitchException from "./StitchException";

/**
 * An exception indicating that an error occurred when using the Stitch client, typically before the
 * client performed a request. An error code indicating the reason for the error is included.
 */
export default class StitchClientException extends StitchException {
  /**
   * The StitchClientErrorCode associated with the request.
   */
  public readonly errorCode: StitchClientErrorCode;

  /**
   * Constructs a client exception with the given error code.
   */
  public constructor(errorCode: StitchClientErrorCode) {
    super("");
    this.errorCode = errorCode;
  }
}