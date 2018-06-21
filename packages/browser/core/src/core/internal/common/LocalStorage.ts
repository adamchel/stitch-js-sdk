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

import { Storage } from "mongodb-stitch-core-sdk";

/** @hidden */
export default class LocalStorage implements Storage {
  constructor(private readonly suiteName: string) {}

  public get(key: string): any {
    return localStorage.getItem(`${this.suiteName}.${key}`);
  }
  public set(key: string, value: string): any {
    return localStorage.setItem(`${this.suiteName}.${key}`, value);
  }
  public remove(key: string): any {
    return localStorage.removeItem(`${this.suiteName}.${key}`);
  }
}
