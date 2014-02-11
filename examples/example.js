(function () {   
    
    $(function () {
        var phoneOne = $('#phoneOne'),
            phoneTwo = $('#phoneTwo'),
            phoneWithExt = $('#phoneWithExt'),
            australiaPhone = $('#australiaPhone'),
            zipCode = $('#zipCode'),
            tinCode = $('#tinCode'),
            npiCode = $('#npiCode'),
            date = $('#date'),
            postalCode = $('#postalCode');tinCode
  
        phoneOne.maskPlugin('(999) 9999-999', {
            placeholder: '_'
        });

        phoneTwo.maskPlugin('(999) 9999-999', {
            placeholder: '_'
        });

        phoneWithExt.maskPlugin('(999) 9999-999 x 9999', {
            placeholder: '_',
            unmaskedPosition: 14,
            clearIncomplete: true
        });

        australiaPhone.maskPlugin('99 9999 9999', {
            placeholder: '_',
            clearIncomplete: true
        });

        zipCode.maskPlugin('99999-9999', {
            unmaskedPosition: 5
        });

        npiCode.maskPlugin('9999999999', {
            clearIncomplete: true
        });

        tinCode.maskPlugin('99-9999999');

        postalCode.maskPlugin('99999-9999', {
            placeholder: '_',
            clearIncomplete: true
        });

        date.maskPlugin('99/99/99', {
            placeholder: '_',
            clearIncomplete: true
        });
    });



}(jQuery))