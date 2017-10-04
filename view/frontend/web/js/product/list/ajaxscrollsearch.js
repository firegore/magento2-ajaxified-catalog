var typingTimer;  
var doneTypingInterval = 500; 
var run=1;

$(".action.search").click(function(e){clearTimeout(typingTimer); e.preventDefault(); search();});
$('#search').bind("enterKey",function(e){if ($('#search').val() != "") {clearTimeout(typingTimer);search();}});
$('#search').keyup(function(e){if (e.which != 13) {e.preventDefault();clearTimeout(typingTimer);typingTimer = setTimeout(doneTyping, doneTypingInterval);}});
require(['jquery', 'jquery/ui', 'domReady!'], function($){ 

$('#search').on('keydown', function () {e.preventDefault();clearTimeout(typingTimer);});
function doneTyping () {if ($('#search').val() != "") {search();}}

// Bind a scroll event for the whole page
$(window).bind('scroll', function() {
    if($(window).scrollTop() >= $('.column.main').offset().top + $('.column.main').outerHeight() - window.innerHeight - 400 && run == 1) {
		if ($(".products.wrapper").length != 0) {
			$('.column.main').append($('<div class="spinner"><div class="dot1"></div><div class="dot2"></div></div>'));
			run=0;
			if (typeof $('.action.next').attr('href') !== "undefined") {
				
				$.ajax({url: $('.action.next').attr('href'), type: "get", data: { ajax: 1}, dataType: "json",success: function(result){
					$('.action.next').remove();
					$('.spinner').remove();
					$('.column.main').append(result['html']['products_list']);
					$('.toolbar-products').slice(1).hide();
					$("form[data-role='tocart-form']").catalogAddToCart();
					run=1;
				}});
			} else {
				$('.spinner').remove();
				$('.products-end').remove();
				$('.products.wrapper').append("<p class=\"products-end\">No More Products</p>");
				run=1;
			}
		}
    }
});

function search() {
	term = $("#search").val();
	$("#page-title-heading").empty();
	$(".columns" ).empty();
	$(".breadcrumbs").empty();
	$('.sidebar-main').empty();
	$('.page-title-wrapper').remove();
	$('.page-bottom').remove();
	$('#maincontent').prepend($('<div class="page-title-wrapper"><h1 class="page-title" id="page-title-heading" aria-labelledby="page-title-heading toolbar-amount"></h1></div>'));
	if ($(".breadcrumbs").length == 0) {
		$("#maincontent").before('<div class="breadcrumbs"></div>');
	}
	if ($(".columns > .sidebar-main").length == 0) {
		$('.columns').empty();
		$('.columns').append($('<div class="sidebar sidebar-main"></div>'));
		$('.columns').append($('<div class="column main"></div>'));
		$('.column.main').append($('<div class="products wrapper"></div>'));
		document.body.className = 'page-with-filter page-products catalog-category-view page-layout-2columns-left';
	}
	
	$('#maincontent').append($('<div class="spinner main"><div class="dot1"></div><div class="dot2"></div></div>'));

	$.ajax({url: "/catalogsearch/result/index/", type: "get", data: { ajax: "1", q: term}, dataType: "json",success: function(result){
		$('.spinner.main').remove();
		$("#page-title-heading").html("Search results for: '" + term + "'");
		$(".breadcrumbs" ).html("<ul class=\"items\"><li class=\"item home\"><a href=\"http://playground.buzzcateringsupplies.com/\" title=\"Go to Home Page\">Home</a></li><li class=\"item\">Search results for: '" + term + "'</a></li></ul>")
		$('.products.wrapper').html(result['html']['products_list']);
		filters = result['html']['filters'].replace("&ajax=1", '');
		$('.sidebar-main').html(filters);
		$('body').trigger('contentUpdated');
		$('.column.main').trigger('contentUpdated');
		$('.sidebar-main').trigger('contentUpdated');
		$("form[data-role='tocart-form']").catalogAddToCart();
		setFilterHeight();
	}});
	
}
});