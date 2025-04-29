    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();

    const authEndpoint = 'https://yckfd07uph.execute-api.us-east-1.amazonaws.com/latest';
    const sdkKey = 'PfPapLCavJc2ZBjMkssNeqboLdBOpoAEXQTc';
    const meetingNumber = '95160050210';
    const passWord = '123';
    const role = 1; // MUST BE HOST to access virtual background
    const userName = 'JavaScript';
    const userEmail = 'java@coffee.com';
    const leaveUrl = 'https://zoom.us';

    function getSignature() {
      fetch(authEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingNumber, role }),
      })
        .then((res) => res.json())
        .then((data) => startMeeting(data.signature))
        .catch((err) => console.error('Signature Error', err));
    }

    function waitForVirtualBackgroundController(maxWaitMs = 10000, intervalMs = 1000) {
      return new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
          const vbController = ZoomMtg.virtualBackgroundController;
          if (vbController && typeof vbController.updateVirtualBackgroundList === 'function') {
            resolve(vbController);
          } else if (Date.now() - start >= maxWaitMs) {
            reject(new Error('virtualBackgroundController not available after waiting.'));
          } else {
            console.warn('Waiting for virtualBackgroundController...');
            setTimeout(check, intervalMs);
          }
        };
        check();
      });
    }

    async function updateVirtualBackgroundList() {
      try {
        const vbController = await waitForVirtualBackgroundController();

        const virtualBackgrounds = [
          {
            id: '1',
            name: 'Beach',
            type: 1,
            path: 'https://yourdomain.com/background1.jpg',
          },
          {
            id: '2',
            name: 'Office',
            type: 1,
            path: 'https://yourdomain.com/background2.jpg',
          },
        ];

        vbController.updateVirtualBackgroundList({
          operationType: 0,
          data: virtualBackgrounds,
          success: () => {
            console.log('Virtual background list updated successfully');
            vbController.setVirtualBackground({ id: '1' });
          },
          error: (err) => {
            console.error('Failed to update virtual background list', err);
          },
        });
      } catch (err) {
        console.error('virtualBackgroundController not ready:', err);
      }
    }

    function startMeeting(signature) {
      document.getElementById('zmmtg-root').style.display = 'block';

      ZoomMtg.init({
        leaveUrl: leaveUrl,
        patchJsMedia: true,
        success: () => {
          ZoomMtg.join({
            signature: signature,
            sdkKey: sdkKey,
            meetingNumber: meetingNumber,
            passWord: passWord,
            userName: userName,
            userEmail: userEmail,
            success: () => {
              console.log('Meeting joined successfully');
              // Wait and try to set virtual backgrounds
              setTimeout(updateVirtualBackgroundList, 2000);
            },
            error: (err) => {
              console.error('Join Error', err);
            },
          });
        },
        error: (err) => {
          console.error('Init Error', err);
        },
      });
    }

    getSignature();
