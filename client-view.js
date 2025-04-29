    ZoomMtg.setZoomJSLib("https://source.zoom.us/3.13.0/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();

    const authEndpoint = 'https://yckfd07uph.execute-api.us-east-1.amazonaws.com/latest';
    const sdkKey = 'PfPapLCavJc2ZBjMkssNeqboLdBOpoAEXQTc';
    const meetingNumber = '95160050210';
    const passWord = '123';
    const role = 1; // Host role is required for virtual background features
    const userName = 'JavaScript';
    const userEmail = 'java@coffee.com';
    const registrantToken = '';
    const zakToken = ''; // Optional but recommended for host
    const leaveUrl = 'https://zoom.us';

    function getSignature() {
      fetch(authEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingNumber: meetingNumber,
          role: role,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Signature received:', data);
          startMeeting(data.signature);
        })
        .catch((error) => {
          console.error('Error fetching signature:', error);
        });
    }

    function updateVirtualBackgroundList() {
      const virtualBackgrounds = [
        {
          id: '1',
          name: 'Background 1',
          type: 1, // 1 = image
          path: 'https://zoom.us/images/en-us/desktop/generic/home-bg.jpg'
        },
        {
          id: '2',
          name: 'Background 2',
          type: 1,
          path: 'https://zoom.us/images/en-us/desktop/generic/zoom-bg.jpg'
        }
      ];

      ZoomMtg.updateVirtualBackgroundList({
        vbList: virtualBackgrounds,
        success: () => {
          console.log('Virtual background list updated successfully');
        },
        error: (error) => {
          console.error('Failed to update virtual background list', error);
        },
      });
    }

    function startMeeting(signature) {
      document.getElementById('zmmtg-root').style.display = 'block';

      ZoomMtg.init({
        leaveUrl: leaveUrl,
        patchJsMedia: true,
        isSupportAV: true,
        success: () => {
          ZoomMtg.join({
            signature: signature,
            sdkKey: sdkKey,
            meetingNumber: meetingNumber,
            passWord: passWord,
            userName: userName,
            userEmail: userEmail,
            tk: registrantToken,
            zak: zakToken,
            success: () => {
              console.log('Join Success');
              updateVirtualBackgroundList();
            },
            error: (error) => {
              console.error('Join Error', error);
            },
          });
        },
        error: (error) => {
          console.error('Init Error', error);
        },
      });
    }

    // Start the process
    getSignature();




