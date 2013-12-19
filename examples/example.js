$(function () {
    var phoneOne = $('#phoneOne'),
        phoneTwo = $('#phoneTwo'),
        australiaPhone = $('#australiaPhone'),
        zipCode = $('#zipCode'),
        postalCode = $('#postalCode');

    phoneOne.maskPlugin('(999) 9999-999', {
        placeholder: '_',
//        onComplete: function () {
//            alert("You've entered phone number!")
//        }
    });

    phoneTwo.maskPlugin('(999) 9999-999', {
        placeholder: '_'
    });

    australiaPhone.maskPlugin('99 9999 9999', {
        placeholder: '_',
        clearIncomplete: true
    });

//    zipCode.maskPlugin('9999999999', {
//        placeholder: '_',
//        allwaysMask: true
//    });

    postalCode.maskPlugin('99999-9999', {
        placeholder: '_',
        clearIncomplete: true
    });


});