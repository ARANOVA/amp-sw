/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @ts-ignore
import router, { NavigationRoute } from 'workbox-routing';
// @ts-ignore
import { CacheFirst } from 'workbox-strategies';
import { FluxStandardAction } from '../flux-standard-actions';
import AmpNavigationRoute from '../document-caching/AmpNavigationRoute';
//import { AmpPushPlugin } from './AmpPushPlugin';
import { AmpSwModule } from '../core/AmpSwModule';
//import { AMP_PUSH_SUBSCRIPTION } from './constants';

/** @enum {string} */
const WorkerMessengerCommand = {
  AMP_SUBSCRIPTION_STATE: 'amp-web-push-subscription-state',
  AMP_SUBSCRIBE: 'amp-web-push-subscribe',
  AMP_UNSUBSCRIBE: 'amp-web-push-unsubscribe',
};

export type PushSubscriptionOptions = {
  kk: Number;
};

//let navigationRoute_: AmpNavigationRoute;
let pushSubscriptionOptions_: PushSubscriptionOptions | undefined;

export class PushSubscriptionAmpModule implements AmpSwModule {
  async init(
    pushSubscriptionOptions: PushSubscriptionOptions,
    navigationRoute: AmpNavigationRoute,
  ) {
    this.listenForPushSubscriptions();
    await this.registerPushSubscription(
      navigationRoute,
      pushSubscriptionOptions,
    );
  }

  /**
   * Listens for post messaged links to be prefetch, in case
   * the browser doesnt support <link rel=prefetch.
   */
  listenForPushSubscriptions() {
    self.addEventListener('message', (messageEvent: ExtendableMessageEvent) => {
      const data: FluxStandardAction<[string]> = JSON.parse(messageEvent.data);
      // TODO
      if (
        data.type in
          [
            WorkerMessengerCommand.AMP_SUBSCRIBE,
            WorkerMessengerCommand.AMP_SUBSCRIPTION_STATE,
            WorkerMessengerCommand.AMP_UNSUBSCRIBE,
          ] &&
        data.payload
      ) {
        messageEvent.waitUntil(this.kk_(data));
      }
    });
  }

  /**
   * Registers already push subscription to navigation-preload denyList.
   */
  async registerPushSubscription(
    navigationRoute: AmpNavigationRoute,
    pushSubscriptionOptions?: PushSubscriptionOptions,
  ) {
    pushSubscriptionOptions_ = pushSubscriptionOptions;
    //TODO
    console.log(navigationRoute, pushSubscriptionOptions_);
  }

  async kk_(data: Object) {
    console.log('MESSAGE', data);
  }
}
