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

import {
  CoreHttpServiceClient,
  HttpRequest,
  HttpResponse
} from "mongodb-stitch-core-services-http";
import { HttpServiceClient } from "../HttpServiceClient";

/** @hidden */
export default class HttpServiceClientImpl implements HttpServiceClient {
  public constructor(private readonly proxy: CoreHttpServiceClient) {}

  /**
   * Executes the given {@link HttpRequest}.
   *
   * @param request the request to execute.
   * @return a task containing the response to executing the request.
   */
  public execute(request: HttpRequest): Promise<HttpResponse> {
    return this.proxy.execute(request);
  }
}
