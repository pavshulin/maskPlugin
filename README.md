<h2> jQuery Mask Plug-in </h2>

<p>Mask Plug-in is a jQuery plug-in for entering data in input field. It allows correct entering and exception handling of the next user's data: phone number, date, data with fixed length.The major advantage of offered mask: it doesn't allow user to reach empty (not entered) part of input.</p>

<p>For starting work with mask plug-in you simply need invoke <code>maskPlugin</code> on your input selector, and delegate mask string in
first argument, and parameteres in second. There is a common approach to start work with mask plug-in:</p>
<pre><code>$('#input selector').maskPlugin(mask, [parametres]);</code></pre> 
<h5>For Example:</h5> 
<pre><code>$('#phone').maskPlugin('(999) 999-9999');
$('#date').maskPlugin('99/99/99');
</code></pre>
<p>Each symbols in mask string will be checked on definition object. Existing characters in this object will be treated like regexp rule, and in input will be looks like placeholder (by default <code>_</code>). Another symbols will be handled like accessory mask pattern. By default, mask definitions looks like:</p>
<pre><code>definitions: {
    9: '[0-9]',
    'a': "[A-Za-z]",
    '*': "[A-Za-z0-9]"
}</code></pre>
<p>You can simply change this behavior, or assosiate any new symbols with some RegExp pattern via changing $.maskPlugin.definitions object like:</p>  
<pre><code>$.maskPlugin.definitions object['*'] = "[A-Za-z0-9]"</code></pre>

<h4>Parameters</h4>

<h5>clearIncomplete:</h5>
<p>By default, mask plug-in didn't clear up the input if user leave the field without completed text. For applying that logic you 
must put <code>{clearIncomplete: true}</code> in second argument.</p> 
<p>Example:</p>
<pre><code>$('#date').maskPlugin('99/99/99', {
	clearIncomplete: true
});</code></pre>


<h5>allwaysMask:</h5>
Parameter <p><code>allwaysMask</code> makes input field masked permanently, despite of focus state, starting from initialization of plug-in.</p> 
<p>Example:</p>
<pre><code>$('#date').maskPlugin('99/99/99', {
	allwaysMask: true
});</code></pre>
<h5>placeholder:</h5>
<p>You can also change default placeholder '_'. You should put <code>{placeholder: 'yourPlaceholder'}</code> in mask parameters. Please note, placeholder should contain only one symbol.</p> 
<p>Example:</p
<pre><code>$('#date').maskPlugin('99/99/99', {
	placeholder: '*'
});</code></pre>

<h5>unmaskedPosition:</h5>
<p>You may simply add argument <code>unmaskedPosition</code> to mask parameters for defining count of necessary symbols / characters</p> 
<p>Example:</p>
<pre><code>$('#zip-code').maskPlugin('99999-9999', {
	clearIncomplete: true,
	unmaskedPosition: 5
});</code></pre>

<h4>Methods</h4>

<h5>destroy:</h5>
<p>Method <code>destroy</code> will remove mask object, and unbind all mask's listeners from input field. All custom events will not be affected.</p> 
<p>Example:</p>
<pre><code>$('#input-date').maskPlugin('99/99/99');
$('#input-date').data('maskPlugin').destroy();</code></pre>

<h5>reset:</h5>
<p>If you want to reinitialize existing mask, you can simply invoke <code>reset</code>> method, and delegate to it the same mask parameters.</p> 
<p>Example:</p>
<pre><code>$('#input-date').maskPlugin('99/99/99');
$('#input-date').data('maskPlugin').reset('99\99\99');
</code></pre>
<p> In fact, invoking <code>maskPlugin</code> constructor on already masked input is the same as <code>reset</code> function calling.</p>