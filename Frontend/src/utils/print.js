export const printDiv = (divName) => {
	var printContents = document.getElementById(divName).innerHTML;
	var originalContents = document.body.innerHTML;

	document.body.innerHTML = printContents;

	window.print();
	window.location.reload();

	document.body.innerHTML = originalContents;
};
