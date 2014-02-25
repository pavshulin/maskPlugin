<h2>jQuery Mask Plug-in</h2>

<p>Mask Plug-in is a jQuery plug-in for entering data in certain format into input text field. It allows controlling correct entering of data and handling the exceptions of the entered data like phone number, date, etc. and data with fixed length. The major advantage of mask plug-in is a restriction of reaching the unfilled part of an input.</p>

<p>To start working with mask plug-in you simply need to invoke <code>maskPlugin</code> on your input jQuery selector, pass mask string as a first argument and parameters as a second one. Please see a common approach of how to start working with mask plug-in below:</p>
<pre><code>$('#input selector').maskPlugin(mask, [parameters]);</code></pre> 
<h5>Example:</h5> 
<pre><code>$('#phone').maskPlugin('(999) 999-9999');
$('#date').maskPlugin('99/99/99');
</code></pre>
<p>Each symbol of mask string is compared to <code>definitions</code> object keys. Characters in this object are treated as a regular expression rules. These characters will appear as a placeholder (by default 
<code>_</code>) in the input. Other symbols are handled like accessory mask pattern. By default, mask <code>definitions</code> object has following appearance:</p>
<pre><code>definitions: {
    9: '[0-9]',
    'a': "[A-Za-z]",
    '*': "[A-Za-z0-9]"
}</code></pre>
<p>You can simply change default behavior or associate any new symbol with another regular expression via changing <code>$.maskPlugin.definitions</code> object.</p>
<h5>Example:</h5>   
<pre><code>$.maskPlugin.definitions object['*'] = "[A-Za-z0-9]"</code></pre>

<h4>Parameters</h4>

<h5>clearIncomplete:</h5>
<p>By default, mask plug-in doesn’t clean up the input when user leaves uncompleted text field. To enable this logic, you should set <code>{clearIncomplete: true}</code> as a parameter during mask plug-in initialization in the second argument.</p> 
<p>Example:</p>
<pre><code>$('#date').maskPlugin('99/99/99', {
	clearIncomplete: true
});</code></pre>


<h5>allwaysMask:</h5>
<p><code>allwaysMask</code> allows to make input field masked permanently despite of focus state, starting from plug-in initialization.</p> 
<p>Example:</p>
<pre><code>$('#date').maskPlugin('99/99/99', {
	allwaysMask: true
});</code></pre>
<h5>placeholder:</h5>
<p><code>placeholder</code> parameter allows to change default placeholder <code>'_'</code> to a custom one. You should set <code>{placeholder: 'yourPlaceholder'}</code> in mask parameters. Please note placeholder must contain only one symbol.</p> 
<p>Example:</p
<pre><code>$('#date').maskPlugin('99/99/99', {
	placeholder: '*'
});</code></pre>

<h5>unmaskedPosition:</h5>
<p><code>unmaskedPosition</code> defines a number of required masked symbols/characters. Default value is <code>false</code> which means that all masked characters are mandatory.</p> 
<p>Example:</p>
<pre><code>$('#zip-code').maskPlugin('99999-9999', {
	clearIncomplete: true,
	unmaskedPosition: 5
});</code></pre>

<h4>Methods</h4>

<h5>destroy:</h5>
<p>Method <code>destroy</code> removes mask object and unbinds all mask listeners from input field. Custom event listeners will not be affected by calling <code>destroy</code>.</p> 
<p>Example:</p>
<pre><code>$('#input-date').maskPlugin('99/99/99');
$('#input-date').data('maskPlugin').destroy();</code></pre>

<h5>reset:</h5>
<p>Method <code>reset</code> allows to re-initialize mask plug-in on existing input, you can simply invoke this method with new parameters to have new mask applied. Please note that invoking <code>maskPlugin</code> constructor on already masked input is the same as calling <code>reset</code> method.</p> 
<p>Example:</p>
<pre><code>$('#input-date').maskPlugin('99/99/99');
$('#input-date').data('maskPlugin').reset('99\99\99');
</code></pre>
<p> In fact, invoking <code>maskPlugin</code> constructor on already masked input is the same as <code>reset</code> function calling.</p>