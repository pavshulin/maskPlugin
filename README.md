<h2> jQuery Mask Plugin </h2>

<p>Mask Plugin - is a tool to help user to do routine task - entering data. With this plugin you can define such a certain format 
like phone number date or similar with fixed length.</p>

<p>For starting work with mask plugin you simply need invoke 'maskPlugin' on your input selector, and delegate mask string in
first argument, and parameteres in second. There are a common approach to start work with mask plugin:
<pre><code>$('#input selector').maskPlugin(mask, [parametres]);</code></pre>
</p>
<h5>For Example:</h5> 
<pre><code>$('#phone').maskPlugin('(999) 999-9999');
$('#date').maskPlugin('99/99/99');
</code></pre>
<h4> Pameteres</h4>

<p>By default, mask plugin didn't clear up the input if user leave the field without completed text. For applying that logic you 
must put 'clearIncomplete' parameter to true in second hash argument.
</p>
<p>'allwaysMask' making input field masked permanently, despite of focus state, starting from initialization of plagin</p>
<p>Toy can also change default placeholder '_', just put placeholder: 'yourPlaceholder', in mask parameters. Please note, placeholder should contain only one symbol.</p>
<p>For defining necessary symbols / characters you may simply add  argument 'unmaskedPosition' to mask parameters.</p>