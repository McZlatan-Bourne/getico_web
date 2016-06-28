//All JS Triggers

function scrollTo(hash) {
  location.hash = "#" + hash;
}

function handleResponse(response){
	if(typeof response =='object'){
		for (var layout in response) {
		  switch (layout ) {
			case 'error':
				$("#alert").html('<div class="alert alert-danger" role="alert"><center>'+response[layout]+'</center></div>');
				break;

			case 'redirect':
				lSiteFadeIn = false
				window.location.replace(response[layout])
				break;

			case 'getForm':
				getForm(response[layout]);
				break;

			case 'alert':
				$('#'+layout).html(response[layout]);
				$('#'+layout).slideDown(500);
				setTimeout(function (layout) {
						$('#'+layout).slideUp(500);
					}, 10000, layout 
				);
				break;
			
			case 'practicealert':
				$('#'+layout).html(response[layout]);
				$('#'+layout).slideDown(250)
				break;

			default:
				layoutID = layout.replace('.','')
				
				switch (layoutID) {
					case 'editpage':
						if ($('#viewpagediv').css('display') == "block") {
							// hideShowForm('viewpagediv');
						}
						if ($('#searchpagediv').css('display') == "block") {
							// hideShowForm('searchpagediv');
						}
						break;

					case 'refreshviewform':
						getForm(response[layoutID]);
						break;
						
					case 'viewpage':
						if ($('#editpagediv').css('display') == "block") {
							// hideShowForm('editpagediv');
						}
						if ($('#searchpagediv').css('display') == "block") {
							// hideShowForm('searchpagediv');
						}
						// response[layout] += $('#'+layoutID).html() 
						break;

					case 'searchpage':
						if ($('#editpagediv').css('display') == "block") {
							hideShowForm('editpagediv');
						}
						if ($('#viewpagediv').css('display') == "block") {
							hideShowForm('viewpagediv');
						}
						break;

					default:
						if ($('#editpagediv').css('display') == "block") {
							hideShowForm('editpagediv');
						}
						break;
				} 
				$('#'+layoutID).html(response[layout]);
				break;
		  }
		}
	} 
	stopLoading();
}


function getForm(formUrl) {
	startLoading();
	aUrl = formUrl.split("?")
	$.post(aUrl[0]+"?",aUrl[1], function(response,status){
		handleResponse(response);
	});
}

function getDropdown(dropdown,formUrl) {
	
	$("#"+dropdown).html('<li style="margin:15px" class="dropdown-header text-center"><img style="" src="/files/siteloader.gif"/></li>');
	$.get(formUrl, "", function(response,status){
		if(typeof response =='object'){
			for (var layout in response) {
				switch (layout ) {
					default:        
						$('#'+layout).html(response[layout]);
						break;
				}
			}
		}
	});
}

function hideShowForm(divtohideshow) {
	
	if ($('#'+divtohideshow).css('display') == "block") {
		$('#'+divtohideshow).fadeOut(250); //hide
		$('#'+divtohideshow+'eye').removeClass('fa-eye');
		$('#'+divtohideshow+'eye').addClass('fa-eye-slash');
		$('#'+divtohideshow+'eye').attr('title','Show');
	} else {
		$('#'+divtohideshow).fadeIn(250); //Show
		$('#'+divtohideshow+'eye').removeClass('fa-eye-slash');
		$('#'+divtohideshow+'eye').addClass('fa-eye');  
	}

}

function startLoading(){
	$("#page").hide();
	//$("#viewpage").hide();
	//$("#searchpage").hide();
	$("#pageloading").fadeIn(10);
}

function stopLoading(){
	$("#page").fadeIn(10);
	//$("#viewpage").fadeIn(10);
	// $("#searchpage").fadeIn(10);
	$("#pageloading").hide();
}

function toggleChecked(fieldId) {
	if ($('#'+fieldId).prop('checked')){
		$('#'+fieldId).prop('checked', false);
	} else {
		$('#'+fieldId).prop('checked', true);
	}
}

function toggleMore(){
	if ($('.moreinfo').css('display') === 'block'){
		$('.moreinfo').hide();
		$('#toggleMore').removeClass('fa fa-toggle-up');
		$('#toggleMore').addClass('fa fa-toggle-down');
	} else {
		$('.moreinfo').show();
		$('#toggleMore').removeClass('fa fa-toggle-down');
		$('#toggleMore').addClass('fa fa-toggle-up');
	}
}

function toggleStar(star,fieldId){
	max = 0;
	for (counter = 1; counter <= 5; counter++){
		if ($('#'+fieldId+counter).hasClass('fa fa-star')){
			$('#'+fieldId+counter).removeClass('fa fa-star');
			max = counter;
		} 

		$('#'+fieldId+counter).addClass('fa fa-star-o') 
	}

	if (star == max) {
		star = 0;
	}

	for (counter = 1; counter <= star; counter++){
		$('#'+fieldId+counter).removeClass('fa fa-star-o');
		$('#'+fieldId+counter).addClass('fa fa-star');
	}

	$('#'+fieldId).val(star);
}


$(function() {
	// alert(window.innerHeight)
	$('.customNavbarClass').click( function(){
		if (window.innerWidth < 768) {
			setTimeout(function() {$(".navbar-toggle").click();}, 125);
		}
	});
});


$('#home').on("submit", "#form", function (event) {
	startLoading();
	event.preventDefault();
	var formUrl = "?"        
	var formData = new FormData($(this)[0]);

	 $.ajax({
			url: formUrl,
			type: 'POST',
			data: formData,
			async: true,
			cache: false,
			contentType: false,
			processData: false,
			success: function (response) {
				handleResponse(response);
			},
			error: function(){
				$("#preloader").hide();
				$("#site").fadeIn(250);
				BootstrapDialog.show({
			  message: "Network Connectivity Issue <br> Please Confirm Internet Access <br> Try Again."});
			}
		});

	return false;
});


function getModal(modalTitle, formUrl){
	$("#modalTitle").html(modalTitle);
	$.get(formUrl, "", function(response,status){
		if(typeof response =='object'){
			for (var layout in response) {
			  switch (layout ) {
				case 'error':
					$("#form").html("");
					$("#alert").html('<div class="alert alert-danger" role="alert"><center>'+response[layout]+'</center></div>');
					break;
				case 'redirect':
					window.location.replace(response[layout])
					break;
			  }
			}
		} else {
			$("#alert").html("");
			$("#form").html(response);
		}
		$('#formModal').modal('show');
	});
}