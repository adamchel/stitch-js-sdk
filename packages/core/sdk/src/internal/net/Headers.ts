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


/** 
 * @hidden
 * HTTP Header definitions and helper methods. 
 */
export default class Headers {
  public static readonly CONTENT_TYPE_CANON = "Content-Type";
  public static readonly CONTENT_TYPE = Headers.CONTENT_TYPE_CANON.toLocaleLowerCase();

  public static readonly AUTHORIZATION_CANON = "Authorization";
  public static readonly AUTHORIZATION = Headers.AUTHORIZATION_CANON.toLocaleLowerCase();

  /**
   * @param value The bearer value
   * @return A standard Authorization Bearer header value.
   */
  public static getAuthorizationBearer(value: string): string {
    return `${Headers.AUTHORIZATION_BEARER} ${value}`;
  }

  private static readonly AUTHORIZATION_BEARER = "Bearer";
}
