/*
 * AnythingSlider FX Builder 1.0.1
 * By Rob Garrison (aka Mottie & Fudgey)
 * Dual licensed under the MIT and GPL licenses.
 */

function setupFxBuilder(){
	// don't do anything if jQuery isn't loaded or AnythingSlider isn't active
	if (typeof jQuery !== 'undefined' && jQuery('.anythingBase').length){

		// add css stylesheet
		// very basic since we don't know what version of jQuery is being used
		if (!jQuery.find('link.fxbuilder').length ){
			jQuery("head")
			.append("<link class='fxbuilder'>")
			.find(".fxbuilder")
			.attr({
				rel : "stylesheet",
				type: "text/css",
				href: "http://css-tricks.github.com/AnythingSlider-Fx-Builder/css/builder.css"
			});
		}

		// load easing function if needed
		var e = typeof jQuery.easing;
		if (e === 'undefined' || (e === 'object' && typeof jQuery.easing.easeInQuad === 'undefined')) {
			jQuery.getScript("http://css-tricks.github.com/AnythingSlider/js/jquery.easing.1.2.js");
		}

		if (typeof jQuery.fn.anythingSliderFx !== 'function'){
			// load fx extension
			jQuery.getScript("http://css-tricks.github.com/AnythingSlider/js/jquery.anythingslider.fx.js", function(){
				anythingSliderFxBuilder();
			});
		} else {
			anythingSliderFxBuilder();
		}
	}
}

function anythingSliderFxBuilder(){
	// no slider on the page
	if (!jQuery('.anythingBase').length) { return; }
	// remove previous popup if bookmarklet called again - allows for updating the slider dynamically
	jQuery('#as-fxb-builder').remove();

	// defaults
	var container, selections, sel = '', content = '', e, s, t, tag, tar, that,
	panels, dat, popup = '', s1 = '', row, ls = !!window.localStorage,
	slider = jQuery('.anythingBase:first').anythingSliderFx(), orig, flag = false,
	fxlist = ['top',  'bottom', 'left', 'right', 'fade', 'expand', 'grow', 'listLR', 'listRL', 'caption-Top', 'caption-Bottom', 'caption-Left', 'caption-Right'],

	// add a row (element, custom, fx, distance, time, easing)
	addRow = function(el,cu,fx,di,ti,ea){
		// make sure the distance has a px or %
		if (!/\d+(px|\%)/i.test(di)) {
			if (isNaN(di)) {
				di = parseInt(di, 10) || ''; // parse it out because it's not a number
			}
			di += (di === '') ? '' : 'px'; // add px to end if it's a number without a suffix
		}
		// make sure time is a number
		if (isNaN(ti)){
			ti = parseInt(ti, 10) || '';
		}
		var row = '<tr><td>' + el + '</td><td>' + cu + '</td><td>' + fx.join(' ') + '</td><td>' + di + '</td><td>' + ti + '</td><td>' +
		ea + '</td><td class="panel"><a href="#" class="button test asfxbuildertooltip {width:100px;}" title="Test the FX"><span>&#9654;</span></a> ' +
		'<a href="#" title="Remove this FX" class="button delete asfxbuildertooltip {width:120px;}"><span>X</span></a></td></tr>';
		selections.find('tbody').append(row);
	},
	buildList = function(obj){
		var c, a, fx = '.anythingSliderFx({\n', o = {},
			list = selections.find('tbody tr').not('tr.spacer'),
			len = list.length - 1;
		list.each(function(i){
			// 'img:first' : [ 'expand', '10%', , 'easeOutBounce' ]
			// addRow('.panel3 img.expand','',['expand'],'10%','','easeOutBounce');
			c = jQuery(this).find('td');
			a = [c.eq(2).text(), c.eq(3).text(), c.eq(4).text(), c.eq(5).text()];
			// remove empty strings from the end so the output looks nicer
			// "ul" : [ "top", "", "", "" ] becomes "ul" : [ "top" ]
			while (a[a.length-1] === ''){ a.pop(); }
			o[c.eq(0).text() + c.eq(1).text()] = a;
			fx += ' "' + c.eq(0).text() + c.eq(1).text() + '" : [ "' + a.join('", "') + '" ]';
			fx += (i < len) ? ',\n' : '';
		});
		return (obj) ? o : fx + '\n});';
	};

	// build popup
	for (e in jQuery.easing){
		if (e.match('ease')) {
			s1 += '<option>' + e + '</option>';
		}
	}
	popup = '<div id="as-fxb-builder">' +
	'<!--[if lte IE 7]><style type="text/css" media="screen">#as-fxb-builder{width:780px;}#as-fxb-builder h2 span.close,#as-fxb-builder h2 a{top:-20px;}</style><![endif]-->' +
	'<h2>' +
		'AnythingSlider FX Builder ' +
		'<span class="close"></span>' +
		'<a class="asfxbuildertooltip" target="_blank" title="Need Help? Click me!" href="https://github.com/CSS-Tricks/AnythingSlider-Fx-Builder"></a>' +
	'</h2>' +
	'<div id="as-fxb-selections">' +
		'<table>' +
			'<thead>' +
				'<tr>' +
					'<th>' +
						'Element' +
						'<span class="required asfxbuildertooltip" title="Choose one of the elements inside your slider <span class=required>(required if Custom Selector block is empty)</span>">*</span><br>' +
						'<select id="as-fxb-elements">' +
							'<option data-sel="" selected>{none}</option>' +
						'</select>' +
					'</th>' +
					'<th>' +
						'Custom<br>Selector<span class="required asfxbuildertooltip" title="Add a custom jQuery selector to target the element(s) <span class=required>(required if the Element block is empty)</span>">*</span><br>' +
						'<input id="as-fxb-custom" type="text" placeholder="Add a custom selector">' +
					'</th>' +
					'<th>' +
						'FX<span class="required asfxbuildertooltip" title="Choose one or more FX styles <span class=required>(required)</span>">*</span><br>' +
						'<select id="as-fxb-fxlist" multiple>' +
						'<option>' + fxlist.join('</option><option>') + '</option>' +
						'</select>' +
					'</th>' +
					'<th>' +
						'Distance/Size<br>(<span class="asfxbuildertooltip" title="Enter a distance to set how far the element moves from its original position (use pixels or percentage)">px or %</span>)<br>' +
						'<input type="text" id="as-fxb-distance" placeholder="Enter distance">' +
					'</th>' +
					'<th>' +
						'Time<br>(<span class="asfxbuildertooltip" title="Enter the effects time in milliseconds (1000 ms = 1 second)">ms</span>)<br>' +
						'<input type="text" id="as-fxb-time" placeholder="Enter a time">' +
					'</th>' +
					'<th>' +
						'Easing (<a class="asfxbuildertooltip" title="Easing is basically the style of the animation. It can be applied to resizing as well as movement. Click this link to see what each one does" target="_blank" href="http://jquery-ui.googlecode.com/svn/trunk/demos/effect/easing.html">?</a>)<br>' +
						'<select id="as-fxb-easing">' +
							'<option selected>swing</option><option>linear</option>' + s1 +
						'</select>' +
					'</th>' +
					'<th class="fxbu">' +
						'<a href="#" class="button getcode asfxbuildertooltip" title="Get the current FX list code"><span>Get Code</span></a>' +
						'<a href="#" class="button test testall asfxbuildertooltip {width:100px;}" title="Test all FX"><span>&#9654; all</span></a><hr>' +
						'<a href="#" class="button add asfxbuildertooltip" title="Add current selections to the list"><span>Add</span></a>' +
					'</th>' +
				'</tr>' +
			'</thead>' +
			'<tfoot>' +
				'<tr>' +
					'<th colspan="7"><span class="examples">Examples:</span></th>' +
				'</tr>' +
				'<tr>' +
					'<th>div.quoteSlide</th>' +
					'<th></th>' +
					'<th>top</th>' +
					'<th>500px</th>' +
					'<th>400</th>' +
					'<th colspan="2">easeOutElastic</th>' +
				'</tr>' +
				'<tr>' +
					'<th>img</th>' +
					'<th>:first</th>' +
					'<th>expand</th>' +
					'<th>10%</th>' +
					'<th></th>' +
					'<th colspan="2">easeOutBounce</th>' +
				'</tr>' +
				'<tr>' +
					'<th>ul</th>' +
					'<th>&gt; li</th>' +
					'<th>listLR</th>' +
					'<th></th>' +
					'<th></th>' +
					'<th colspan="2">easeInOutBounce</th>' +
				'</tr>' +
				'<tr>' +
					'<th></th>' +
					'<th>li:odd</th>' +
					'<th>left</th>' +
					'<th></th>' +
					'<th></th>' +
					'<th colspan="2"></th>' +
				'</tr>' +
			'</tfoot>' +
			'<tbody>' +
				'<tr class="spacer"><td colspan="7"></td></tr>' +
			'</tbody>' +
		'</table>' +
	'<div class="note"><span class="required">*</span> = required; Element and/or Custom Selector is required.</div>' +

	'</div>';
	jQuery('body')
	.append(popup)

	// make it draggable
	.bind('mouseup mouseleave', function(){
		flag = false;
	})
	.bind('mousemove', function(e){
		if (flag) {
			var l = orig[0] + e.pageX,
				t = orig[1] + e.pageY;
			container[0].style.left = (l < 0 ? 0 : l) + 'px';
			container[0].style.top = (t < 0 ? 0 : t) + 'px';
			if (ls) {
				localStorage.setItem("asfxbPosition", [ (l < 0 ? 0 : l), (t < 0 ? 0 : t) ]);
			}
		}
		return false;
	});
	container = jQuery('#as-fxb-builder');
	container
		.find('h2').bind('mousedown', function(e){
			orig = [ container.offset().left - e.pageX, container.offset().top - e.pageY ];
			flag = true;
		})
		.find('span').bind('click', function(){
			container.remove();
		});

	// Get last position from local storage
	t = (ls) ? localStorage.getItem("asfxbPosition") || '' : '';
	t = (t === '') ? '250,400' : t;
	t = t.split(',');
	container.css({ left: t[0] + 'px', top: t[1] + 'px' });

	// set up FX list
	jQuery('#as-fxb-fxlist').chosen();
	// set up tooltip
	jQuery.jatt();

	// set up Element list
	selections = jQuery('#as-fxb-selections');
	panels = slider.children('li'); // panel class added by the plugin, but add here just in case
	dat = slider.data('AnythingSlider');
	panels.filter(':not(.cloned)').find('*').each(function(i){
		that = jQuery(this);
		// get panel index or class
		tag = that.closest('.panel');
		if (tag.is('.panel')) {
			// get the correct index (cloned panels?)
			t = tag.index();
			if (t === 0) {
				t = '.panel:first ';
			} else if (t === jQuery('.panel').length-1) {
				t = '.panel:last ';
			} else {
				t = '.panel:eq(' + t + ') ';
			}
		} else {
			// get class name
			t = '.' + jQuery.trim( (' ' + tag.attr('class') + ' ').replace('panel ','').replace('activePage','') ); // hoping only one class name is added
		}
		tag = this.tagName.toLowerCase();
		// tags to ignore - /embed for ie7 (http://bugs.jquery.com/ticket/10047) & HTML5 tags (http://bugs.jquery.com/ticket/10048)
		if (tag.match('area|br|param|source|style|script|colgroup|option') || /^\//.test(tag)) { return; }
		// get id or class
		tar = (this.id) ? '#' + this.id : (that.attr('class')) ? '.' + that.attr('class') : '';
		if (tar === '') {
			// find content/attribute to differentiate the element
			if (tag.match('table|thead|tbody|tfoot|tr|ul|hr|map|embed|object|canvas|audio|video|img|iframe')){
				content = '';
			} else {
				content = jQuery.trim( that.text() );
			}
			// show img/iframe src
			if (tag.match('img|iframe|embed')) {
				s = that.attr('src');
				content = s.substring( s.lastIndexOf('/') + 1, s.length);
			}
		}
		// combine panel with tag
		tag = t + ' ' + tag;
		// truncate if longer than 15 characters
		content = (content.length > 10) ? content.substring(0,15) + '...' : content;
		// add option with tag + selector/content
		sel += '<option data-sel="' + tag + tar + '">' + tag +
		(tar !== '' ? tar : ( content !== '' ? ' (' + content + ')' : '' ) ) + '</option>';
	});

	// update element selector
	selections.find('#as-fxb-elements').append(sel);

	// add demo row
	s = jQuery('#as-fxb-elements option');
	t = Math.floor(Math.random()*(s.length-1)) + 1;
	addRow( s.eq(t).attr('data-sel'),'',['top'],'500','','easeOutBounce');

	// add button
	selections
	.find('a.add').bind('click', function(){
		var fx = selections.find('#as-fxb-fxlist').val() || '',
		el = selections.find('#as-fxb-elements option:selected').attr('data-sel') || '',
		cu = selections.find('#as-fxb-custom').val() || '',
		ea = selections.find('#as-fxb-easing').val() || '',
		di = selections.find('#as-fxb-distance').val() || '',
		ti = selections.find('#as-fxb-time').val() || '';
		// Must choose a selector and a fx!
		if (fx === '' || (el === '' && cu === '') ) {
			// add a row showing the error message
			if (!selections.find('tr.remove').length) {
				row = '<tr class="remove"><td colspan="7"><h3 class="delete">You must select or enter the required fields!</h3></td></tr>';
				selections.find('tbody').prepend(row);
				setTimeout(function(){ selections.find('tr.remove').remove(); }, 5000);
			}
			return false;
		}
		addRow(el,cu,fx,di,ti,ea);
		return false;
	}).end()
	.find('a.getcode').bind('click', function(){
		var list = buildList();
		jQuery('<div id="as-fxb-getcode"><textarea>' + list + '</textarea></div><div id="as-fxb-overlay"></div>').appendTo('body');
		jQuery('#as-fxb-overlay').click(function(){ jQuery('#as-fxb-getcode, #as-fxb-overlay').remove(); });
		return false;
	}).end()

	// Delete the FX
	.delegate('a.delete', 'click', function(){
		jQuery(this).closest('tr').remove();
		return false;
	})
	// Test the FX!
	.delegate('a.test', 'click', function(){
		var all = jQuery(this).is('.testall'),
		cells = jQuery(this).closest('tr').find('td'),
		t, i, fx = [], page;
		// reset all animations
		dat.$items.find('.fxapplied').each(function(){
			t = this.style;
			jQuery.each(['top','left','right','bottom','width','opacity'], function(i,v){
				if (t[v] !== '') { t[v] = ''; }
			});
		});
		// add all FX and play slideshow
		if (all) {
			dat.fx = buildList(true);
			dat.startStop(true);
		} else {
			// add row FX only and go to page
			for (i=0; i<6; i++) {
				fx[i] = cells.eq(i).text() || '';
			}
			page = slider.find( (fx[0] === '' ? fx[1] : fx[0].split(' ')[0]) ).closest('.panel');
			dat.fx = {}; // clear out all other FX
			dat.fx[fx[0] + fx[1]] = [ fx[2], fx[3], fx[4], fx[5] ];
			// set page for FX
			dat.gotoPage(panels.index(page) + (dat.options.infiniteSlides ? 0 : 1));
		}
		return false;
	});

	// escape to close the code popup
	jQuery(document).keyup(function(e){
		if (e.which === 27) {
			jQuery('#as-fxb-getcode, #as-fxb-overlay').remove();
		}
	});

}

// Chosen, a Select Box Enhancer for jQuery and Protoype
// by Patrick Filler for Harvest, http://getharvest.com
// 
// Version 0.9.1
// Full source at https://github.com/harvesthq/chosen
// Copyright (c) 2011 Harvest http://getharvest.com

// MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
// This file is generated by `cake build`, do not edit it by hand.
(function(){var c,f,g,h,d=function(b,a){return function(){return b.apply(a,arguments)}};h=this;c=jQuery;c.fn.extend({chosen:function(b,a){return c(this).each(function(){if(!c(this).hasClass("chzn-done"))return new f(this,b,a)})}});f=function(){function b(a){this.set_default_values();this.form_field=a;this.form_field_jq=c(this.form_field);this.is_multiple=this.form_field.multiple;this.is_rtl=this.form_field_jq.hasClass("chzn-rtl");this.default_text_default=this.form_field.multiple?"Select FX":"Select an Option"; this.set_up_html();this.register_observers();this.form_field_jq.addClass("chzn-done")}b.prototype.set_default_values=function(){this.click_test_action=d(function(a){return this.test_active_click(a)},this);this.active_field=!1;this.mouse_on_container=!1;this.results_showing=!1;this.result_highlighted=null;this.result_single_selected=null;return this.choices=0};b.prototype.set_up_html=function(){var a,e,b,d;this.container_id=this.form_field.id.length?this.form_field.id.replace(/(:|\.)/g,"_"):this.generate_field_id(); this.container_id+="_chzn";this.f_width=this.form_field_jq.width();this.default_text=this.form_field_jq.data("placeholder")?this.form_field_jq.data("placeholder"):this.default_text_default;a=c("<div />",{id:this.container_id,"class":"chzn-container "+(this.is_rtl?"chzn-rtl":""),style:"width: "+this.f_width+"px;"});this.is_multiple?a.html('<ul class="chzn-choices"><li class="search-field"><input type="text" value="'+this.default_text+'" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop" style="left:-9000px;"><ul class="chzn-results"></ul></div>'): a.html('<a href="javascript:void(0)" class="chzn-single"><span>'+this.default_text+'</span><div><b></b></div></a><div class="chzn-drop" style="left:-9000px;"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>');this.form_field_jq.hide().after(a);this.container=c("#"+this.container_id);this.container.addClass("chzn-container-"+(this.is_multiple?"multi":"single"));this.dropdown=this.container.find("div.chzn-drop").first();e=this.container.height(); b=this.f_width-g(this.dropdown);this.dropdown.css({width:b+"px",top:e+"px"});this.search_field=this.container.find("input").first();this.search_results=this.container.find("ul.chzn-results").first();this.search_field_scale();this.search_no_results=this.container.find("li.no-results").first();this.is_multiple?(this.search_choices=this.container.find("ul.chzn-choices").first(),this.search_container=this.container.find("li.search-field").first()):(this.search_container=this.container.find("div.chzn-search").first(), this.selected_item=this.container.find(".chzn-single").first(),d=b-g(this.search_container)-g(this.search_field),this.search_field.css({width:d+"px"}));this.results_build();return this.set_tab_index()};b.prototype.register_observers=function(){this.container.click(d(function(a){return this.container_click(a)},this));this.container.mouseenter(d(function(a){return this.mouse_enter(a)},this));this.container.mouseleave(d(function(a){return this.mouse_leave(a)},this));this.search_results.click(d(function(a){return this.search_results_click(a)}, this));this.search_results.mouseover(d(function(a){return this.search_results_mouseover(a)},this));this.search_results.mouseout(d(function(a){return this.search_results_mouseout(a)},this));this.form_field_jq.bind("liszt:updated",d(function(a){return this.results_update_field(a)},this));this.search_field.blur(d(function(a){return this.input_blur(a)},this));this.search_field.keyup(d(function(a){return this.keyup_checker(a)},this));this.search_field.keydown(d(function(a){return this.keydown_checker(a)}, this));return this.is_multiple?(this.search_choices.click(d(function(a){return this.choices_click(a)},this)),this.search_field.focus(d(function(a){return this.input_focus(a)},this))):this.selected_item.focus(d(function(a){return this.activate_field(a)},this))};b.prototype.container_click=function(a){a&&a.type==="click"&&a.stopPropagation();return!this.pending_destroy_click?(this.active_field?!this.is_multiple&&a&&(c(a.target)===this.selected_item||c(a.target).parents("a.chzn-single").length)&&(a.preventDefault(), this.results_toggle()):(this.is_multiple&&this.search_field.val(""),c(document).click(this.click_test_action),this.results_show()),this.activate_field()):this.pending_destroy_click=!1};b.prototype.mouse_enter=function(){return this.mouse_on_container=!0};b.prototype.mouse_leave=function(){return this.mouse_on_container=!1};b.prototype.input_focus=function(){if(!this.active_field)return setTimeout(d(function(){return this.container_click()},this),50)};b.prototype.input_blur=function(){if(!this.mouse_on_container)return this.active_field= !1,setTimeout(d(function(){return this.blur_test()},this),100)};b.prototype.blur_test=function(){if(!this.active_field&&this.container.hasClass("chzn-container-active"))return this.close_field()};b.prototype.close_field=function(){c(document).unbind("click",this.click_test_action);this.is_multiple||(this.selected_item.attr("tabindex",this.search_field.attr("tabindex")),this.search_field.attr("tabindex",-1));this.active_field=!1;this.results_hide();this.container.removeClass("chzn-container-active"); this.winnow_results_clear();this.clear_backstroke();this.show_search_field_default();return this.search_field_scale()};b.prototype.activate_field=function(){!this.is_multiple&&!this.active_field&&(this.search_field.attr("tabindex",this.selected_item.attr("tabindex")),this.selected_item.attr("tabindex",-1));this.container.addClass("chzn-container-active");this.active_field=!0;this.search_field.val(this.search_field.val());return this.search_field.focus()};b.prototype.test_active_click=function(a){return c(a.target).parents("#"+ this.container_id).length?this.active_field=!0:this.close_field()};b.prototype.results_build=function(){var a,e,b,c,d;this.parsing=!0;this.results_data=h.SelectParser.select_to_array(this.form_field);this.is_multiple&&this.choices>0?(this.search_choices.find("li.search-choice").remove(),this.choices=0):this.is_multiple||this.selected_item.find("span").text(this.default_text);a="";d=this.results_data;for(b=0,c=d.length;b<c;b++)e=d[b],e.group?a+=this.result_add_group(e):e.empty||(a+=this.result_add_option(e), e.selected&&this.is_multiple?this.choice_build(e):e.selected&&!this.is_multiple&&this.selected_item.find("span").text(e.text));this.show_search_field_default();this.search_field_scale();this.search_results.html(a);return this.parsing=!1};b.prototype.result_add_group=function(a){return!a.disabled?(a.dom_id=this.container_id+"_g_"+a.array_index,'<li id="'+a.dom_id+'" class="group-result">'+c("<div />").text(a.label).html()+"</li>"):""};b.prototype.result_add_option=function(a){var e;return!a.disabled? (a.dom_id=this.container_id+"_o_"+a.array_index,e=a.selected&&this.is_multiple?[]:["active-result"],a.selected&&e.push("result-selected"),a.group_array_index!=null&&e.push("group-option"),'<li id="'+a.dom_id+'" class="'+e.join(" ")+'">'+a.html+"</li>"):""};b.prototype.results_update_field=function(){this.result_clear_highlight();this.result_single_selected=null;return this.results_build()};b.prototype.result_do_highlight=function(a){var e,b,c,d;if(a.length){this.result_clear_highlight();this.result_highlight= a;this.result_highlight.addClass("highlighted");b=parseInt(this.search_results.css("maxHeight"),10);d=this.search_results.scrollTop();c=b+d;e=this.result_highlight.position().top+this.search_results.scrollTop();a=e+this.result_highlight.outerHeight();if(a>=c)return this.search_results.scrollTop(a-b>0?a-b:0);if(e<d)return this.search_results.scrollTop(e)}};b.prototype.result_clear_highlight=function(){this.result_highlight&&this.result_highlight.removeClass("highlighted");return this.result_highlight= null};b.prototype.results_toggle=function(){return this.results_showing?this.results_hide():this.results_show()};b.prototype.results_show=function(){var a;this.is_multiple||(this.selected_item.addClass("chzn-single-with-drop"),this.result_single_selected&&this.result_do_highlight(this.result_single_selected));a=this.is_multiple?this.container.height():this.container.height()-1;this.dropdown.css({top:a+"px",left:0});this.results_showing=!0;this.search_field.focus();this.search_field.val(this.search_field.val()); return this.winnow_results()};b.prototype.results_hide=function(){this.is_multiple||this.selected_item.removeClass("chzn-single-with-drop");this.result_clear_highlight();this.dropdown.css({left:"-9000px"});return this.results_showing=!1};b.prototype.set_tab_index=function(){var a;if(this.form_field_jq.attr("tabindex")){a=this.form_field_jq.attr("tabindex");this.form_field_jq.attr("tabindex",-1);if(this.is_multiple)return this.search_field.attr("tabindex",a);this.selected_item.attr("tabindex",a);return this.search_field.attr("tabindex", -1)}};b.prototype.show_search_field_default=function(){if(this.is_multiple&&this.choices<1&&!this.active_field)return this.search_field.val(this.default_text),this.search_field.addClass("default");this.search_field.val("");return this.search_field.removeClass("default")};b.prototype.search_results_click=function(a){a=c(a.target).hasClass("active-result")?c(a.target):c(a.target).parents(".active-result").first();if(a.length)return this.result_highlight=a,this.result_select()};b.prototype.search_results_mouseover= function(a){if(a=c(a.target).hasClass("active-result")?c(a.target):c(a.target).parents(".active-result").first())return this.result_do_highlight(a)};b.prototype.search_results_mouseout=function(a){if(c(a.target).hasClass("active-result"))return this.result_clear_highlight()};b.prototype.choices_click=function(a){a.preventDefault();if(this.active_field&&!c(a.target).hasClass("search-choice")&&!this.results_showing)return this.results_show()};b.prototype.choice_build=function(a){var e;e=this.container_id+ "_c_"+a.array_index;this.choices+=1;this.search_container.before('<li class="search-choice" id="'+e+'"><span>'+a.html+'</span><a href="javascript:void(0)" class="search-choice-close" rel="'+a.array_index+'"></a></li>');a=c("#"+e).find("a").first();return a.click(d(function(a){return this.choice_destroy_link_click(a)},this))};b.prototype.choice_destroy_link_click=function(a){a.preventDefault();this.pending_destroy_click=!0;return this.choice_destroy(c(a.target))};b.prototype.choice_destroy=function(a){this.choices-= 1;this.show_search_field_default();this.is_multiple&&this.choices>0&&this.search_field.val().length<1&&this.results_hide();this.result_deselect(a.attr("rel"));return a.parents("li").first().remove()};b.prototype.result_select=function(){var a,e,b,c;if(this.result_highlight)return a=this.result_highlight,e=a.attr("id"),this.result_clear_highlight(),a.addClass("result-selected"),this.is_multiple?this.result_deactivate(a):this.result_single_selected=a,c=e.substr(e.lastIndexOf("_")+1),b=this.results_data[c], b.selected=!0,this.form_field.options[b.options_index].selected=!0,this.is_multiple?this.choice_build(b):this.selected_item.find("span").first().text(b.text),this.results_hide(),this.search_field.val(""),this.form_field_jq.trigger("change"),this.search_field_scale()};b.prototype.result_activate=function(a){return a.addClass("active-result").show()};b.prototype.result_deactivate=function(a){return a.removeClass("active-result").hide()};b.prototype.result_deselect=function(a){var b,d;d=this.results_data[a]; d.selected=!1;this.form_field.options[d.options_index].selected=!1;b=c("#"+this.container_id+"_o_"+a);b.removeClass("result-selected").addClass("active-result").show();this.result_clear_highlight();this.winnow_results();this.form_field_jq.trigger("change");return this.search_field_scale()};b.prototype.results_search=function(){return this.results_showing?this.winnow_results():this.results_show()};b.prototype.winnow_results=function(){var a,b,d,g,h,f,j,i,l,k,q,m,n,r,s,p;this.no_results_clear();j=0; i=this.search_field.val()===this.default_text?"":c("<div/>").text(c.trim(this.search_field.val())).html();h=RegExp("^"+i.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),"i");q=RegExp(i.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),"i");p=this.results_data;for(m=0,r=p.length;m<r;m++)if(b=p[m],!b.disabled&&!b.empty)if(b.group)c("#"+b.dom_id).hide();else if(!this.is_multiple||!b.selected){a=!1;f=b.dom_id;if(h.test(b.html))a=!0,j+=1;else if(b.html.indexOf(" ")>=0||b.html.indexOf("[")===0)if(g=b.html.replace(/\[|\]/g, "").split(" "),g.length)for(n=0,s=g.length;n<s;n++)d=g[n],h.test(d)&&(a=!0,j+=1);a?(i.length?(l=b.html.search(q),k=b.html.substr(0,l+i.length)+"</em>"+b.html.substr(l+i.length),k=k.substr(0,l)+"<em>"+k.substr(l)):k=b.html,c("#"+f).html!==k&&c("#"+f).html(k),this.result_activate(c("#"+f)),b.group_array_index!=null&&c("#"+this.results_data[b.group_array_index].dom_id).show()):(this.result_highlight&&f===this.result_highlight.attr("id")&&this.result_clear_highlight(),this.result_deactivate(c("#"+f)))}return j< 1&&i.length?this.no_results(i):this.winnow_results_set_highlight()};b.prototype.winnow_results_clear=function(){var a,b,d,g,f;this.search_field.val("");b=this.search_results.find("li");f=[];for(d=0,g=b.length;d<g;d++)a=b[d],a=c(a),f.push(a.hasClass("group-result")?a.show():!this.is_multiple||!a.hasClass("result-selected")?this.result_activate(a):void 0);return f};b.prototype.winnow_results_set_highlight=function(){var a,b;if(!this.result_highlight&&(b=this.is_multiple?[]:this.search_results.find(".result-selected"), a=b.length?b.first():this.search_results.find(".active-result").first(),a!=null))return this.result_do_highlight(a)};b.prototype.no_results=function(a){var b;b=c('<li class="no-results">No results match "<span></span>"</li>');b.find("span").first().html(a);return this.search_results.append(b)};b.prototype.no_results_clear=function(){return this.search_results.find(".no-results").remove()};b.prototype.keydown_arrow=function(){var a,b;this.result_highlight?this.results_showing&&(b=this.result_highlight.nextAll("li.active-result").first(), b&&this.result_do_highlight(b)):(a=this.search_results.find("li.active-result").first(),a&&this.result_do_highlight(c(a)));if(!this.results_showing)return this.results_show()};b.prototype.keyup_arrow=function(){var a;if(!this.results_showing&&!this.is_multiple)return this.results_show();if(this.result_highlight){a=this.result_highlight.prevAll("li.active-result");if(a.length)return this.result_do_highlight(a.first());this.choices>0&&this.results_hide();return this.result_clear_highlight()}};b.prototype.keydown_backstroke= function(){if(this.pending_backstroke)return this.choice_destroy(this.pending_backstroke.find("a").first()),this.clear_backstroke();this.pending_backstroke=this.search_container.siblings("li.search-choice").last();return this.pending_backstroke.addClass("search-choice-focus")};b.prototype.clear_backstroke=function(){this.pending_backstroke&&this.pending_backstroke.removeClass("search-choice-focus");return this.pending_backstroke=null};b.prototype.keyup_checker=function(a){var b,c;b=(c=a.which)!=null? c:a.keyCode;this.search_field_scale();switch(b){case 8:if(this.is_multiple&&this.backstroke_length<1&&this.choices>0)return this.keydown_backstroke();if(!this.pending_backstroke)return this.result_clear_highlight(),this.results_search();break;case 13:a.preventDefault();if(this.results_showing)return this.result_select();break;case 27:if(this.results_showing)return this.results_hide();break;case 9:case 38:case 40:case 16:break;default:return this.results_search()}};b.prototype.keydown_checker=function(a){var b, c;b=(c=a.which)!=null?c:a.keyCode;this.search_field_scale();b!==8&&this.pending_backstroke&&this.clear_backstroke();switch(b){case 8:this.backstroke_length=this.search_field.val().length;break;case 9:this.mouse_on_container=!1;break;case 13:a.preventDefault();break;case 38:a.preventDefault();this.keyup_arrow();break;case 40:this.keydown_arrow()}};b.prototype.search_field_scale=function(){var a,b,d,g,f,h,j;if(this.is_multiple){f=0;d="position:absolute; left: -1000px; top: -1000px; display:none;";g= "font-size,font-style,font-weight,font-family,line-height,text-transform,letter-spacing".split(",");for(h=0,j=g.length;h<j;h++)a=g[h],d+=a+":"+this.search_field.css(a)+";";b=c("<div />",{style:d});b.text(this.search_field.val());c("body").append(b);f=b.width()+25;b.remove();f>this.f_width-10&&(f=this.f_width-10);this.search_field.css({width:f+"px"});a=this.container.height();return this.dropdown.css({top:a+"px"})}};b.prototype.generate_field_id=function(){var a;a=this.generate_random_id();this.form_field.id= a;return a};b.prototype.generate_random_id=function(){var a;for(a="sel"+this.generate_random_char()+this.generate_random_char()+this.generate_random_char();c("#"+a).length>0;)a+=this.generate_random_char();return a};b.prototype.generate_random_char=function(){var a;a=Math.floor(Math.random()*36);return"0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ".substring(a,a+1)};return b}();g=function(b){return b.outerWidth()-b.width()};h.get_side_border_padding=g}).call(this); (function(){var c;c=function(){function c(){this.options_index=0;this.parsed=[]}c.prototype.add_node=function(c){return c.nodeName==="OPTGROUP"?this.add_group(c):this.add_option(c)};c.prototype.add_group=function(c){var f,d,b,a,e,o;f=this.parsed.length;this.parsed.push({array_index:f,group:!0,label:c.label,children:0,disabled:c.disabled});e=c.childNodes;o=[];for(b=0,a=e.length;b<a;b++)d=e[b],o.push(this.add_option(d,f,c.disabled));return o};c.prototype.add_option=function(c,f,d){if(c.nodeName==="OPTION")return c.text!== ""?(f!=null&&(this.parsed[f].children+=1),this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,value:c.value,text:c.text,html:c.innerHTML,selected:c.selected,disabled:d===!0?d:c.disabled,group_array_index:f})):this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,empty:!0}),this.options_index+=1};return c}();c.select_to_array=function(f){var g,h,d,b;h=new c;b=f.childNodes;for(f=0,d=b.length;f<d;f++)g=b[f],h.add_node(g);return h.parsed};this.SelectParser= c}).call(this);

/*
 * Jatt - just another tooltip v2.8.2 min
 * http://github.com/Mottie/Jatt
 * by Rob Garrison (aka Mottie)
 *
 * based on tooltip by Alen Grakalic (http://cssglobe.com/post/1695/easiest-tooltip-and-image-preview-using-jquery)
 * tooltip modification by Rob G, aka Mottie (http://wowmotty.blogspot.com/)
 *
 */
(function(c,v,t){c.jatt=function(w){var f,r,s=[],u=c("body"),m=c(t),p=c(v),d=c.extend({},c.jatt.defaultOptions,w);c.jatt.ttrelocate=function(f,h){var j=c("#"+h),b=j.outerWidth(),e=j.outerHeight(),a=j.data("options")||d,q={e:[a.xOffset,-e/2,b+a.xOffset,e/2],se:[a.xOffset,a.yOffset,b+a.xOffset,e+a.yOffset],s:[-b/2,a.yOffset,b/2,e+a.yOffset],sw:[-b-a.xOffset,a.yOffset,-a.xOffset,e+a.yOffset],w:[-b-a.xOffset,-e/2,-a.xOffset,e/2],nw:[-b-a.xOffset,-e-a.yOffset,-a.xOffset,-a.yOffset],n:[-b/2,-e-a.yOffset, b/2,-a.yOffset],ne:[a.xOffset,-e-a.yOffset,b+a.xOffset,-a.yOffset]}[a.direction],k=p.scrollTop(),m=p.scrollLeft(),i=c(f.target),g=f.pageX||i.position().left+i.width()/2,l=f.pageY||i.position().top+i.height()/2;a.followMouse||(g=i.outerWidth(),l=i.outerHeight(),l={e:[g,l/2],se:[g,l],s:[g/2,l],sw:[0,l],w:[0,l/2],nw:[0,0],n:[g/2,0],ne:[g,0]},g=i.offset().left+l[a.direction][0],l=i.offset().top+l[a.direction][1]);var i=g+q[0],o=l+q[1];g+q[2]>m+p.width()-a.xOffset&&(i=p.width()-b-a.xOffset);l+q[3]>k+p.height()- a.yOffset&&(o=l-e-a.yOffset);i<m+a.xOffset&&(i=m+a.xOffset);o<k+a.yOffset&&(o=l+a.yOffset);g>i&&g<i+b&&l>o&&l<o+e&&(o+=o-e/2-a.yOffset<k+a.yOffset?e/2+a.yOffset:-e/2-a.yOffset);j.css({left:i+"px",top:o+"px"})};c.jatt.getMeta=function(n){f=c.extend({},d);var h,j=[],b=n.attr(d.metadata)||"",b=b.match(/(\{.*\})/g)?b.match(/(\{.*\})/g)[0]:n.attr(d.metadata)||"",b=b.match("width|background|color|border|direction|followMouse|content|speed|local|xOffset|yOffset|zIndex")?b:n.attr("data-jatt")||"";b!==""&& (b=b.replace(/(\{|\'|\"|\})/g,""),b.match("direction|followMouse|content|speed|local|xOffset|yOffset|zIndex")&&(c.each(b.split(";"),function(b,a){h=a.split(":");if(h[0].match("direction|followMouse|content|speed|local|xOffset|yOffset|zIndex")){var d=c.trim(h[0]),k=c.trim(h[1]);f[d]=k=="true"||k=="false"?k=="true"?!0:!1:isNaN(k)?k:parseFloat(k)}else j.push(a)}),b=j.join(";")));return[f,b]};c.jatt.removeTooltips=function(){for(c("#"+d.previewId+", #"+d.tooltipId).remove();c("#"+d.previewId+", #"+d.tooltipId).length> 0;)c("#"+d.previewId+", #"+d.tooltipId).remove()};c.jatt.preloadContent=function(f){var h,j,b,e,a,m=[],k=c(d.tooltip);for(a=f.length;a--;)h=t.createElement("img"),h.src=f[a],s.push(h);k.each(function(a){j=c(this);this.tagName==="A"&&j.is(d.preloadContent)&&(e=c(this).attr("href")||"",e!==""&&!e.match(/^#/)&&(b=c('<div rel="'+a+'" />'),m.push(b),b.load(e,function(){k.eq(b.attr("rel")).data("tooltip",b.html())})))})};(function(){var n=d.live?"live":"bind",h=[];c.each("initialized.jatt beforeReveal.jatt revealed.jatt hidden.jatt".split(" "), function(f,b){var e=b.split(".")[0];c.isFunction(d[e])&&m.bind(b,d[e])});c(d.tooltip)[n](d.activate,function(j){c.jatt.removeTooltips();var b,e,a,h,k,n,i,g=c(this);b=d.metadata.toString()==="false"?[d,""]:c.jatt.getMeta(g);m.trigger("initialized.jatt",g);f=b[0];e=g.attr(f.content)===""?g.data("tooltip")||"":g.attr(f.content)||"";h=g.attr("rel")||"";k=g.attr("href")||"";g.data("tooltip",e);g.attr("title","");b='<div id="'+d.tooltipId+'" style="position:absolute;z-index:'+f.zIndex+";"+b[1]+'"><span class="body"></span><span class="close">x</span></div>'; f.local?g.before(b):u.append(b);a=c("#"+d.tooltipId);if(e==="")if(h!=="")e=c(h).html()||d.notFound;else if(k!=="")e=d.loading,n=c("<div />"),n.load(k,function(){i=n.html();s=d.cacheData?i:"";a.hide().find(".body").html(i);g.data("tooltip",s);c.jatt.ttrelocate(j,d.tooltipId);a.fadeIn(f.speed)});a.data("options",f).find(".body").html(e);c.jatt.ttrelocate(j,d.tooltipId);g.is(d.sticky)&&a.find(".close").show().click(function(){c.jatt.removeTooltips()});m.trigger("beforeReveal.jatt",g);a.fadeIn(f.speed); m.trigger("revealed.jatt",g)})[n](d.deactivate,function(){c(this).is(d.sticky)||(c.jatt.removeTooltips(),m.trigger("hidden.jatt",this))})[n]("mousemove",function(j){c("#"+d.tooltipId).length&&f.followMouse&&c.jatt.ttrelocate(j,d.tooltipId)});r=function(j,b,e){m.trigger("initialized.jatt",b);var a,h=d.metadata.toString()=="false"?[d,""]:c.jatt.getMeta(b);f=h[0];a=b.attr(f.content)===""?b.data("tooltip")||"":b.attr(f.content)||"";b.data("tooltip",a);f.content==="title"&&b.attr(f.content,"");e='<div id="'+ d.previewId+'" style="position:absolute;z-index:'+f.zIndex+";"+h[1]+'"><span class="body"><img src="'+e;e+=a!==""?"<br/>"+a:"";e+='</span><span class="close">x</span></div>';f.local?b.before(e):u.append(e);a=c("#"+d.previewId);m.trigger("beforeReveal.jatt",b);a.hide().data("options",f).fadeIn(f.speed);b.is(d.sticky)&&a.find(".close").show().click(function(){c.jatt.removeTooltips()});c.jatt.ttrelocate(j,d.previewId);m.trigger("revealed.jatt",b)};c(d.preview)[n](d.activate,function(f){c.jatt.removeTooltips(); r(f,c(this),c(this).attr("href")+'" alt="'+d.imagePreview+'" />')}).each(function(){h.push(c(this).attr("href"))});c(d.screenshot)[n](d.activate,function(f){c.jatt.removeTooltips();var b=c(this),e=b.attr("rel")==="#"?d.websitePreview+b.attr("href"):b.attr("rel");e+='" alt="'+d.siteScreenshot+b.attr("href")+'" />';r(f,b,e)}).each(function(){var f=c(this);h.push(f.attr("rel")==="#"?d.websitePreview+f.attr("href"):f.attr("rel"))});c(d.preview+","+d.screenshot)[n](d.deactivate,function(){c(this).is(d.sticky)|| (c.jatt.removeTooltips(),m.trigger("hidden.jatt",this))})[n]("mousemove",function(h){c("#"+d.previewId).length&&f.followMouse&&c.jatt.ttrelocate(h,d.previewId)});c.jatt.preloadContent(h)})()};c.jatt.defaultOptions={direction:"e",followMouse:!1,content:"title",speed:300,local:!1,xOffset:20,yOffset:20,zIndex:1E3,live:!0,metadata:"class",activate:"mouseenter focusin",deactivate:"mouseleave focusout",cacheData:!0,websitePreview:"http://api1.thumbalizr.com/?width=250&url=",loading:"Loading...",notFound:"No tooltip found", imagePreview:"Image preview",siteScreenshot:"URL preview: ",tooltip:".asfxbuildertooltip",screenshot:"a.screenshot",preview:"a.preview",preloadContent:".preload",sticky:".sticky",tooltipId:"tooltip",previewId:"preview"}})(jQuery,this,document);
