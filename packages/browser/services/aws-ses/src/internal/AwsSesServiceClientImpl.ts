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
  AwsSesSendResult,
  CoreAwsSesServiceClient
} from "mongodb-stitch-core-services-aws-ses";
import { AwsSesServiceClient } from "../AwsSesServiceClient";

/** @hidden */
export default class AwsSesServiceClientImpl implements AwsSesServiceClient {
  public constructor(private readonly proxy: CoreAwsSesServiceClient) {}

  /**
   * Sends an email.
   *
   * @param to the email address to send the email to.
   * @param from the email address to send the email from.
   * @param subject the subject of the email.
   * @return a task containing the result of the send that completes when the send is done.
   */
  public sendEmail(
    to: string,
    from: string,
    subject: string,
    body: string
  ): Promise<AwsSesSendResult> {
    return this.proxy.sendEmail(to, from, subject, body);
  }
}
