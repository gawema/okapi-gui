export const convertDateToDMY = (inputDateTime) => {
	let onlyDate = inputDateTime.slice(0, 10)
	let yyyymmdd= onlyDate.split('-',3);
	let ddmmyyy = yyyymmdd[2]+"-"+yyyymmdd[1]+"-"+yyyymmdd[0]
	return ddmmyyy
	//TODO:
	// chek locale
	// error handling
	// check date input format
}

