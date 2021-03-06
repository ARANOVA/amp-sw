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

window.__waitForSWState = (registration, desiredState) => {
  return new Promise((resolve, reject) => {
    let serviceWorker = registration.installing;

    if (!serviceWorker) {
      return reject(
        new Error(
          'The service worker is not installing. Is the test environment clean?',
        ),
      );
    }

    const stateListener = evt => {
      if (evt.target.state === desiredState) {
        serviceWorker.removeEventListener('statechange', stateListener);
        return resolve();
      }

      if (evt.target.state === 'redundant') {
        serviceWorker.removeEventListener('statechange', stateListener);

        return reject(new Error('Installing service worker became redundant'));
      }
    };

    serviceWorker.addEventListener('statechange', stateListener);
  });
};
