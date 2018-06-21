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
  CoreStitchServiceClient,
  CoreStitchServiceClientImpl,
  Decoder,
  StitchAuthRequestClient,
  StitchServiceRoutes
} from "mongodb-stitch-core-sdk";
import StitchServiceClient from "./StitchServiceClient";

/** @hidden */
export default class StitchServiceImpl extends CoreStitchServiceClientImpl
  implements StitchServiceClient {
  public constructor(
    requestClient: StitchAuthRequestClient,
    routes: StitchServiceRoutes,
    name: string
  ) {
    super(requestClient, routes, name);
  }

  public callFunction<T>(
    name: string,
    args: any[],
    codec?: Decoder<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      resolve(this.callFunctionInternal(name, args, codec));
    });
  }
}
