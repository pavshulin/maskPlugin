<h2> jQuery Mask Plugin </h2>

<p>Mask Plugin - is a tool which help user to do casual task - entering data. With this plugin you can define such a certain format 
like phone number date or similar with fixed length.</p>

<p>For starting work with mask plugin you simply need invoke 'maskPlugin' on your input selector, and delegate mask string in
first argument, and parameteres in second. There are a common approach to start work with mask plugin:
<code style="width:100%;">
    $('#input selector').maskPlugin(mask, [parametres]);
</code>
</p>
<h5>For Example:</h5> 
<pre>    
    <code>
$('#phone').maskPlugin('(999) 999-9999');
$('#date').maskPlugin('99/99/99');
    </code>  
</pre>