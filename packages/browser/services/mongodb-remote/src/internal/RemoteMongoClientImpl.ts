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

import { CoreRemoteMongoClient } from "mongodb-stitch-core-services-mongodb-remote";
import { RemoteMongoClient } from "../RemoteMongoClient";
import RemoteMongoDatabase from "../RemoteMongoDatabase";
import RemoteMongoDatabaseImpl from "./RemoteMongoDatabaseImpl";

/** @hidden */
export default class RemoteMongoClientImpl implements RemoteMongoClient {
  constructor(private readonly proxy: CoreRemoteMongoClient) {}

  /**
   * Gets a {@link RemoteMongoDatabase} instance for the given database name.
   *
   * @param name the name of the database to retrieve
   * @return a {@code RemoteMongoDatabase} representing the specified database
   */
  public db(name: string): RemoteMongoDatabase {
    return new RemoteMongoDatabaseImpl(this.proxy.db(name));
  }
}
