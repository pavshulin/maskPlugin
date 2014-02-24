<h2> jQuery Mask Plug-in </h2>

<p>Mask Plug-in is a tool to help user to do routine task - entering data. With this plug-in you can define such a certain format 
like phone number, date or similar with fixed length.</p>

<p>For starting work with mask plug-in you simply need invoke 'maskPlugin' on your input selector, and delegate mask string in
first argument, and parameteres in second. There are a common approach to start work with mask plug-in:
<pre><code>$('#input selector').maskPlugin(mask, [parametres]);</code></pre>
</p>
<h5>For Example:</h5> 
<pre><code>$('#phone').maskPlugin('(999) 999-9999');
$('#date').maskPlugin('99/99/99');
</code></pre>
<h4>Parameters</h4>

<h5>clearIncomplete:</h5>
<p>By default, mask plug-in didn't clear up the input if user leave the field without completed text. For applying that logic you 
must put <code>{clearIncomplete: true}</code> in second argument.</p> 
<p>Example:</p>
<pre><code>$('#date').maskPlugin('99/99/99', {
	clearIncomplete: true
});</code></pre>


<h5>allwaysMask:</h5>
<p><code>allwaysMask</code> making input field masked permanently, despite of focus state, starting from initialization of plug-in.</p> 
<p>Example:</p>
<pre><code>$('#date').maskPlugin('99/99/99', {
	allwaysMask: true
});</code></pre>
<h5>placeholder:</h5>
<p>Toy can also change default placeholder '_', just put <code>{placeholder: 'yourPlaceholder'}</code> in mask parameters. Please note, placeholder should contain only one symbol.</p> 
<p>Example:</p>
<pre><code>$('#date').maskPlugin('99/99/99', {
	placeholder: '*'
});</code></pre>

<h5>unmaskedPosition:</h5>
<p>For defining necessary symbols / characters you may simply add  argument <code>unmaskedPosition</code> to mask parameters. Notice, that you also need <code>clearIncomplete</code> parameter here.</p> 
<p>Example:</p>
<pre><code>$('#zip-code').maskPlugin('99999-9999', {
	clearIncomplete: true,
	unmaskedPosition: 5
});</code></pre>

<h4>Methods</h4>

<h5>destroy:</h5>
<p><code>destroy</code> method will remove mask object, and unbind all mask listeners from input field. All custom events will not be affected.</p> 
<p>Example:</p>
<pre><code>$('#input-date').maskPlugin('99/99/99');
$('#input-date').data('maskPlugin').destroy();</code></pre>

<h5>reset:</h5>
<p>if you want reinitialize existing mask, you may simply invoke <code>reset</code> method, and delegate them the same mask parameters.</p> 
<p>Example:</p>
<pre><code>$('#input-date').maskPlugin('99/99/99');
$('#input-date').data('maskPlugin').reset('99\99\99');
</code></pre>
<p>In fact, invoking <code>maskPlugin</code> constructor on already masked input, means that <code>reset</code> function will be called.</p>