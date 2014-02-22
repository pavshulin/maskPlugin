<h2> jQuery Mask Plugin </h2>

<p>
Mask Plugin - is a tool which help user to do casual task - entering data. With this plugin you can define such a certain format 
like phone number date or similar with fixed length.
</p>

There are a common approach to start work with mask plugin:
<code>
    $('#input selector').maskPlugin(mask, [parametres]);
</code>

that means, you should only invoke maskPlugin method with your mask string on input selector.
For Example: 

<code>
    $('#phone').maskPlugin('(999) 999-9999');

    $('#date').maskPlugin('99/99/99');
<code>  
