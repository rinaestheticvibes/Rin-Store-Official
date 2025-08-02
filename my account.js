// Load data from localStorage
    window.onload = function () {
      const name = localStorage.getItem('profileName');
      const phone = localStorage.getItem('profilePhone');
      const email = localStorage.getItem('profileEmail');
      const gender = localStorage.getItem('profileGender');
      const state = localStorage.getItem('profileState');
      const avatar = localStorage.getItem('profileAvatar');

      if (name) {
        document.getElementById('displayName').textContent = name;
        document.getElementById('nameInput').value = name;
      }

      if (phone) {
        document.getElementById('displayPhone').textContent = `+91 ${phone}`;
        document.getElementById('phoneInput').value = phone;
      }

      if (email) document.getElementById('emailInput').value = email;
      if (gender) document.getElementById('genderInput').value = gender;
      if (state) document.getElementById('stateInput').value = state;

      if (avatar) {
        const img = document.createElement('img');
        img.src = avatar;
        const avatarPreview = document.getElementById('avatarPreview');
        avatarPreview.innerHTML = '';
        avatarPreview.appendChild(img);
      }
    };

    function uploadAvatar(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          localStorage.setItem('profileAvatar', e.target.result);
          const avatarPreview = document.getElementById('avatarPreview');
          const img = document.createElement('img');
          img.src = e.target.result;
          avatarPreview.innerHTML = '';
          avatarPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    }

    function updateProfile() {
      const name = document.getElementById('nameInput').value;
      const phone = document.getElementById('phoneInput').value;
      const email = document.getElementById('emailInput').value;
      const gender = document.getElementById('genderInput').value;
      const state = document.getElementById('stateInput').value;

      if (name) {
        localStorage.setItem('profileName', name);
        document.getElementById('displayName').textContent = name;
      }

      if (phone) {
        localStorage.setItem('profilePhone', phone);
        document.getElementById('displayPhone').textContent = `+91 ${phone}`;
      }

      localStorage.setItem('profileEmail', email);
      localStorage.setItem('profileGender', gender);
      localStorage.setItem('profileState', state);

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your information has been saved!',
        confirmButtonColor: '#1c2dc9'
      });
    }