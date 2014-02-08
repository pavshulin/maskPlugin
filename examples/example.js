(function () {   
    
    $(function () {
        var phoneOne = $('#phoneOne'),
            phoneTwo = $('#phoneTwo'),
            australiaPhone = $('#australiaPhone'),
            zipCode = $('#zipCode'),
            date = $('#date'),
            postalCode = $('#postalCode');

        phoneOne.maskPlugin('(999) 9999-999', {
            placeholder: '_'
        });

        phoneTwo.maskPlugin('(999) 9999-999', {
            placeholder: '_'
        });

        australiaPhone.maskPlugin('99 9999 9999', {
            placeholder: '_',
            clearIncomplete: true
        });

        zipCode.maskPlugin('9999999999', {
           placeholder: '_',
           allwaysMask: true
        });

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