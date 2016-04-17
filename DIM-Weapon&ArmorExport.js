// This is a DIM specific script that can be run in the Developer Console in Chrome on a DIM tab.
// it writes out a csv string with stats and perks for armor, weapons, and ghosts
// Credit to this script goes to wein3967 (https://gist.github.com/wein3967 and www.reddit.com/r/wein3967)
// If you didn't read the README.md, please do now!

// FUNCTIONS
function isArmor(myItem) {
    return myItem.sort === "Armor" && 
		 (myItem.tier === "Legendary" || myItem.tier === "Exotic");
};

function isWeapon(myItem) {
    return myItem.sort === "Weapons" &&
		   (myItem.tier === "Legendary" || myItem.tier === "Exotic");
};

function isGhost(myItem) {
    return myItem.type === "Ghost" &&
		   (myItem.tier === "Legendary" || myItem.tier === "Exotic");
};

function isRealPerk(myItem) { // Omitting "perks" I don't really care about
    return myItem !== "Infuse" && 
            myItem !== "Increase Intellect" && 
	    myItem !== "Increase Discipline" && 
	    myItem !== "Increase Strength" &&
	    myItem !== "Twist Fate" && 
	    myItem !== "The Life Exotic" &&
            myItem !== "Reforge Artifact" && //These are added by DIM to Vault items
            myItem !== "Reforge Shell"; //These are added by DIM to Vault items
};

function statSplit(intVal, discVal, strVal) {
    var statStr = "";
    if (intVal > 0) { statStr = statStr + "I" };
    if (discVal > 0) { statStr = statStr + "D" };
    if (strVal > 0) { statStr = statStr + "S" };
    
    return statStr;
};

function findStatName(statName, statArray) { //Make sure I get the stat I want (single stats exist)
    
    for (k = 0; k < statArray.length; k++) {
        if (statArray[k].name === statName) {
            return statArray[k].value;
            break;
        };
    };
    return 0;
};

function getItemString(item) {
    var descriptionString = item.id + ',' +
                            ',' +
                            item.locked + ',' +
                            item.classTypeName + ',' + 
			    item.tier + ',' + 
			    item.sort + ',' + 
			    item.type + ',' + 
			    item.name + ',' + 
			    item.primStat.value + ',' + 
                            statSplit(findStatName("Intellect", item.stats), findStatName("Discipline", item.stats), findStatName("Strength", item.stats)) + ',' +
                            findStatName("Intellect", item.stats) + ',' +
                            findStatName("Discipline", item.stats) + ',' +
                            findStatName("Strength", item.stats) + ',' +
                            (findStatName("Intellect", item.stats) + findStatName("Discipline", item.stats) + findStatName("Strength", item.stats));
    return descriptionString;
};

function getY1ClassItemString(item) {
    var descriptionString = item.id + ',' +
                            ',' +
                            item.locked + ',' +
                            item.classTypeName + ',' + 
			    item.tier + ',' + 
			    item.sort + ',' + 
			    item.type + ',' + 
			    item.name + ',' + 
			    item.primStat.value;
    return descriptionString;
};

function getPerkList(testObject) {
    var perkList = [];
    
    for (j = 0; j < testObject.talentGrid.nodes.length; j++) {
        if (testObject.talentGrid.nodes[j].hidden == false) { // Ignore hidden perks
            perkList.push(testObject.talentGrid.nodes[j].name);
        };
    };
    
    return perkList.filter(isRealPerk);
};

/////////////////////////////////////////////////////////////////////

// MAIN CODE
var stuff = $('.storage.guardian').scope().vm.stores;
var guardian1_Items = (stuff.length >= 2) ? stuff[0].items : [];
var guardian2_Items = (stuff.length >= 3) ? stuff[1].items : [];
var guardian3_Items = (stuff.length >= 4) ? stuff[2].items : [];
var vaultItems = stuff[stuff.length - 1].items;
var allItems = guardian1_Items.concat(guardian2_Items, guardian3_Items, vaultItems);

var allFilteredItems = allItems.filter(isArmor); //Filter for only Legendary/Exotic armor
allFilteredItems = allFilteredItems.concat(allItems.filter(isWeapon), allItems.filter(isGhost));

var descString = "IndexID,Status,IsLocked,Class,Tier,Armor,Type,Name,Light,StatSplit,Intellect,Discipline,Strength,Quality,Perks" + '\n';

for (i = 0; i < allFilteredItems.length; i++) {
    
    //console.log(allFilteredItems[i].name);
    
    if (allFilteredItems[i].primStat != undefined) {
        
        if (allFilteredItems[i].year === 1 && allFilteredItems[i].type === "ClassItem") {
            descString = descString + getY1ClassItemString(allFilteredItems[i]) + '\n';

        } else {
        
        descString = descString + 
				 getItemString(allFilteredItems[i]) + ',' +
				 getPerkList(allFilteredItems[i]) + 
				 '\n';
    };
};
//console.log(i);
};

descString;
