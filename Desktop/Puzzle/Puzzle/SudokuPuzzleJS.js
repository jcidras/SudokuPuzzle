// Populates the text boxes for each container
$(document).ready(function () 
{
	for (var i = 1; i < 10; i++)
	{			
		PopulateContainerInput(i);			
	}
	
	var listOfSudokuGrids = $("#sudokuPuzzleDiv div");
	listOfSudokuGrids.each(function () {
		RandomlyChooseInputInGrid(this);
	});
});

// Adds click events to all text boxes for validations
// and updates moves played counter.
$(function () 
{
	var sudokuTextList = $(":input[class='SudokuText']");
	sudokuTextList.each(function () 
	{
		$(this).focus(function () 
		{
			CheckForAvailableMoves(this);
		});
		
		$(this).blur(function () 
		{	
			var input = $(this).val();
			if (parseInt(input) > 0 && parseInt(input) < 10)
			{		
				UpdatePlayerMoveCount();		
				ValidateInputForDuplicates(this);
				ValidateInputXAxis(this, false);
				ValidateInputYAxis(this, false);
			}
			else
			{
				if (input != "")
				{
					UpdatePlayerMoveCount();
					UpdateErrorCounter(this, false, "Invalid Input: Input Needs to be 1-9.");
				}
			}
		});
	});
});

// Updates the move played counter on the page.
function UpdatePlayerMoveCount()
{
	var movesPlayed = parseInt($("#lblMovesPlayedValue").val());
	$("#lblMovesPlayedValue").val(++movesPlayed);		
}

// Populates input container dynamically 
function PopulateContainerInput(tableIndex)
{
	var sudokuInputDiv = $("#sudokuInputDiv" + tableIndex);
	var index = 0;
	for (var i = 1; i < 4; i++)
	{			
		for(var j = 1; j < 4; j++)
		{
			var dynamicSudokuTextBox = "<input type='text' id='input" + ++index + "table" + tableIndex + "x" + i + "y" + j + "' class='SudokuText' maxlength='1' />";
			$(sudokuInputDiv).append(dynamicSudokuTextBox);
		}			
		$(sudokuInputDiv).append("<br />");	
	}		
}

// Updates the error counter to the page.
function UpdateErrorCounter(sudokuInput, isXAxis, customMessage)
{		
	if ($("#easyMode").is(":checked"))
	{		
		if (customMessage != "")
		{
			$("#errorMessages").append("<p class='ErrorMessage'>" + customMessage + "</p>");
		}
		else
		{
			if (isXAxis)
			{
				$("#errorMessages").append("<p class='ErrorMessage'>Ooops! Invalid Move: This number is already in this row.</p>");
			}
			else
			{
				$("#errorMessages").append("<p class='ErrorMessage'>Ooops! Invalid Move: This number is already in this column.</p>");
			}
		}
		$(sudokuInput).addClass("InvalidMove");
		var errorsMade = $("#lblErrorsMadeValue").val();
		$("#lblErrorsMadeValue").val(++errorsMade);
	}		
	else
	{	
		var errorsMade = $("#lblErrorsMadeValue").val();
		$("#lblErrorsMadeValue").val(++errorsMade);
	}
}

// Reloads the page. All text boxes with default values.
// Counters are reset.
function ReloadPage()
{
	if (confirm('This will refresh the game. Continue?'))
	{
		var sudokuInputList = $("#sudokuPuzzleDiv :input[type='text']");
		sudokuInputList.each(function () {
			$(this).prop("disabled", false)
				   .css("background-color", "White")
				   .val("");
		});
		$("#lblMovesPlayedValue").val("0");
		$("#lblErrorsMadeValue").val("0");
	}	
}

// Generates a random number from 1 - 9
function GenerateRandomInputNumber()
{
	var randomNumber = Math.floor((Math.random() * 9) + 1);
	return randomNumber;
}

// Checks for duplicate inputs in the selected input's Grid
function ValidateInputForDuplicates(sudokuInput)
{
	var isValid = true;
	var inputDiv = $(sudokuInput).parent().attr('id');
	var inputList = $("#" + inputDiv + " :input[type='text']");		
	$(inputList).each(function () 
	{
		if ($(this).val() != "")
		{
			if (($(this).val() == $(sudokuInput).val()) 
				&& ($(this).attr('id') != $(sudokuInput).attr('id')))
			{
				isValid = false;
				UpdateErrorCounter(sudokuInput, false, "Ooops! Invalid Move: This number is already used in this grid.");
			}
			else
			{
				if ($(this).hasClass("InvalidMove"))
				{
					$(this).removeClass("InvalidMove");
				}
			}
		}
	});
	return isValid;
}

// Validates to see if the input value is valid for the selected
// row.
function ValidateInputXAxis(sudokuInput, isStartUp)
{
	var isValid = true;
	var tableRowClass = $(sudokuInput).parent().attr('class').substring(5, 9);	
	var xCoorindates = $(sudokuInput).attr("id").substring(12, 14);
	var listOfXAxisInputs = $("#sudokuPuzzleDiv div[class*='" + tableRowClass + "'] :input[id*='" + xCoorindates + "']");
	$(listOfXAxisInputs).each(function () 
	{
		if ($(this).val() != "")
		{
			if (($(this).val() == $(sudokuInput).val())
				&& ($(this).attr("id") != $(sudokuInput).attr("id")))
			{
				isValid = false;
				if (!isStartUp)
				{
					UpdateErrorCounter(sudokuInput, true, "");
				}
			}
			else
			{
				if ($(this).hasClass("InvalidMove"))
				{
					$(this).removeClass("InvalidMove");
				}
			}
		}
	});
	return isValid;
}

// Validates to see if the input value is valid for the selected
// column.
function ValidateInputYAxis(sudokuInput, isStartUp)
{
	var isValid = true;
	var tableColumnClass = $(sudokuInput).parent().attr('class').substring(9, 16);
	var yCoorindates = $(sudokuInput).attr("id").substring(14, 16);	
	var listOfYAxisInputs = $("#sudokuPuzzleDiv div[class*='" + tableColumnClass + "'] :input[id*='" + yCoorindates + "']");
	$(listOfYAxisInputs).each(function () 
	{
		if ($(this).val() != "")
		{
			if (($(this).val() == $(sudokuInput).val())
				&& ($(this).attr("id") != $(sudokuInput).attr("id")))
			{						
				isValid = false;
				if (!isStartUp)
				{
					UpdateErrorCounter(sudokuInput, false, "");
				}
			}
			else
			{
				if ($(this).hasClass("InvalidMove"))
				{
					$(this).removeClass("InvalidMove");
				}
			}
		}
	});
	return isValid;
}	

function CheckForAvailableMoves(sudokuInputBox)
{
	var availableMoves = [];
	for (var i = 1; i < 10; i++)
	{
		if ((CheckForAvailableInputGrid(sudokuInputBox, i)) &&
			(CheckForAvailableInputXAxis(sudokuInputBox, i)) &&
			(CheckForAvailableInputYAxis(sudokuInputBox, i)))
		{
			availableMoves.push(i);
		}
	}
	if (availableMoves.length > 0)
	{
		$("#lblAvailableMoves").val(availableMoves);
	}
}

function CheckForAvailableInputGrid(sudokuInputBox, availableInput)
{
	var input = $(sudokuInputBox).val();
	var isValid = true;
	var grid = $(sudokuInputBox).parent().attr("id");
	var sudokuTextBoxList = $("#" + grid + " :input[type='text']");
	var tempSudokuTextBox = $(sudokuInputBox);
	$(tempSudokuTextBox).val(availableInput);
	$(sudokuTextBoxList).each(function () {
		var currentTextValue = $(this).val();
		if (currentTextValue != "")
		{
			if ($(tempSudokuTextBox).val() == currentTextValue &&
				$(tempSudokuTextBox).attr("id") != $(this).attr("id"))
			{
				isValid = false;
			}
		}
	});
	$(tempSudokuTextBox).val(input);
	return isValid;
}

function CheckForAvailableInputXAxis(sudokuInputBox, availableInput)
{
	var input = $(sudokuInputBox).val();
	var isValid = true;
	var tableRowClass = $(sudokuInputBox).parent().attr('class').substring(5, 9);	
	var xCoorindates = $(sudokuInputBox).attr("id").substring(12, 14);
	var sudokuTextBoxList = $("#sudokuPuzzleDiv div[class*='" + tableRowClass + "'] :input[id*='" + xCoorindates + "']");
	var tempSudokuTextBox = $(sudokuInputBox);
	$(tempSudokuTextBox).val(availableInput);
	$(sudokuTextBoxList).each(function () {
		var currentTextValue = $(this).val();
		if (currentTextValue != "")
		{
			if ($(tempSudokuTextBox).val() == currentTextValue &&
				$(tempSudokuTextBox).attr("id") != $(this).attr("id"))
			{
				isValid = false;
			}
		}
	});
	$(tempSudokuTextBox).val(input);
	return isValid;
}

function CheckForAvailableInputYAxis(sudokuInputBox, availableInput)
{
	var input = $(sudokuInputBox).val();
	var isValid = true;
	var tableColumnClass = $(sudokuInputBox).parent().attr('class').substring(9, 16);	
	var yCoorindates = $(sudokuInputBox).attr("id").substring(14, 16);
	var sudokuTextBoxList = $("#sudokuPuzzleDiv div[class*='" + tableColumnClass + "'] :input[id*='" + yCoorindates + "']");
	var tempSudokuTextBox = $(sudokuInputBox);
	$(tempSudokuTextBox).val(availableInput);
	$(sudokuTextBoxList).each(function () {
		var currentTextValue = $(this).val();
		if (currentTextValue != "")
		{
			if ($(tempSudokuTextBox).val() == currentTextValue &&
				$(tempSudokuTextBox).attr("id") != $(this).attr("id"))
			{
				isValid = false;
			}
		}
	});
	$(tempSudokuTextBox).val(input);
	return isValid;
}

// Chooses a random input in a specific grid
function RandomlyChooseInputInGrid(Grid)
{
	var listOfInputsInGrid = $("#" + $(Grid).attr('id') + " :input[type='text']");
	var randomControlIndex = GenerateRandomInputNumber();
	listOfInputsInGrid.each(function () 
	{
		var inputIndex = $(this).attr('id').substring(5,6);
		if (inputIndex == randomControlIndex)
		{
			$(this).val(GenerateRandomInputNumber());
			if ((ValidateInputXAxis(this, true)) &&
				(ValidateInputYAxis(this, true)))
			{
				$(this).prop("disabled", true)
				   .css({
					"background-color": "gray",
					"color": "black"
					});
			}
			else
			{
				$(this).val("");
				return RandomlyChooseInputInGrid(Grid);
			}
		}	
	});	
}

// Refresh the Page. Starts the game over.
$("#btnRefreshPage").click(function () 
{		
	ReloadPage();	
	var listOfSudokuGrids = $("#sudokuPuzzleDiv div");
	listOfSudokuGrids.each(function () {
		RandomlyChooseInputInGrid(this);
	});
});

//Validates Game to see if all inputs are
//correct
$("#btnValidateGame").click(function () 
{
	var isValid = true;
	// Make a list of controls of the form
	var listOfControls = $("#sudokuPuzzleDiv :input[type='text']");
	// Iterate over list and check validation
	listOfControls.each(function () {
		if (!ValidateInputXAxis(this, false, 0))
		{ 
			isValid = false;
		}
		if (!ValidateInputYAxis(this, false, 0))
		{
			isValid = false;
		}			
		if (!ValidateInputForDuplicates(this))
		{
			isValid = false;
		}
	});
	if (!isValid)
	{
		alert("Game has failed validation. Please correct game and revalidate");
	}
	else
	{
		alert("Good Job! This game has passed validation!");
	}
	// Create error message
	$("#errorMadeDiv").css("display", "block");
});

// Toggles Checkboxes between Easy and Hard Mode.
// Each time the checkbox is toggled, a new game starts
// with the selected difficulty
$("input[type='checkbox']").click(function () 
{
	if ($(this).attr('id') == "easyMode") 
	{
		$("#hardMode").prop("checked", false);
		$("#errorsMadeDiv").css("display", "block");
		ReloadPage();
	}
	else if ($(this).attr('id') == "hardMode")
	{
		$("#easyMode").prop("checked", false);
		$("#errorsMadeDiv").css("display", "none");
		ReloadPage();
	}
});