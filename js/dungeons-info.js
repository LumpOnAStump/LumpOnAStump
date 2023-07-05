
function lumpInit() {
    window.lump = window.lump || {};

    window.lump.dun = {
        dungeons: {
            ice: {
                name: "Ice Golem’s Peak",
                sets: "Life:2,Defense:2,Resistance:2,Offense:2,Critical Rate:2,Retaliation:4,Reflex:4,Cursed:4,Provoke:4",
            },
            dragon: {
                name: "Dragon's Lair",
                sets: "Frost:4,Toxic:4,Daze:4,Avenging:4,Stalward:4,Accuracy:2,Speed:2,Lifesteal:4,Destroy:4",
            },
            fire: {
                name: "Fire Knight's Castle",
                sets: "Frenzy:4,Stun:4,Immunity:4,Regeneration:4,Fury:4,Curing:4,Crit Damage:2,Shield:4,Cruel:2",
            },
        },
        difficulty: ["Normal", "Hard"],
        artifacts: {
            stats: "ATK,ATK%,HP,HP%,DEF,DEF%,SPD,ACC,RES,C.RATE,C.DMG".split(","),
            types: {
                Weapon: ["ATK"],
                Helmet: ["HP"],
                Shield: ["DEF"],
                Gauntlets: "ATK,ATK%,HP,HP%,DEF,DEF%,C.RATE,C.DMG".split(","),
                Chestplate: "ATK,ATK%,HP,HP%,DEF,DEF%,ACC,RES".split(","),
                Boots: "ATK,ATK%,HP,HP%,DEF,DEF%,SPD".split(","),
            },
            ranks: [1,2,3,4,5,6],
            rarity: "Common,Uncommon,Rare,Epic,Legendary,Mythic",
            sets: {},
        },
        probs: {
            type: 1,
            rank: 1,
            rarity: 1,
            set: 1,
            stat: 1,
            mutliplier: 1,
            gen: 1,
        },
        nums: {
            primaries: 11,
            secondaries: 10,
        }
    };
    for (const dun in window.lump.dun.dungeons) {
        var sets = window.lump.dun.dungeons[dun].sets.split(",");
        // console.log(["1",dun, window.lump.dun.dungeons, window.lump.dun.dungeons[dun], sets]);
        for (var i = 0; i < sets.length; i++) {
            var info = sets[i].split(":");
            // console.log(["2",i,sets[i],info]);
            window.lump.dun.artifacts.sets[info[0]] = {
                numInSet: parseInt(info[1]),
                dungeon: dun,
            };
        }
    }

    var transpose = m => m[0].map((x,i) => m.map(x => x[i]));
    window.lump.dun.probs = {Normal:{},Hard:{}};
    var rankprobs = [
        [60.0,40.0,0,0,0,0],
        [30.0,60.0,10.0,0,0,0],
        [0,45.0,55.0,0,0,0],
        [0,15.0,60.0,25.0,0,0],
        [0,0,58.0,42.0,0,0],
        [0,0,50.0,50.0,0,0],
        [0,0,34.5,53.0,12.5,0],
        [0,0,27.0,55.0,18.0,0],
        [0,0,20.0,57.0,23.0,0],
        [0,0,0,69.0,31.0,0],
        [0,0,0,60.0,40.0,0],
        [0,0,0,55.0,45.0,0],
        [0,0,0,45.0,50.0,5.0],
        [0,0,0,40.0,54.0,6.0],
        [0,0,0,36.0,56.5,7.5],
        [0,0,0,39.8,52.0,8.2],
        [0,0,0,33.0,56.6,10.4],
        [0,0,0,25.2,61.6,13.2],
        [0,0,0,19.9,62.3,17.8],
        [0,0,0,0,73.0,27.0],
        [0,0,0,0,72.0,28.0],
        [0,0,0,0,71.0,29.0],
        [0,0,0,0,70.0,30.0],
        [0,0,0,0,69.0,31.0],
        [0,0,0,0,68.0,32.0],
    ];
    window.lump.dun.probs.Normal.rank = {1:[],2:[],3:[],4:[],5:[],6:[],any:[],'1+':[],'2+':[],'3+':[],'4+':[],'5+':[],'6+':[],};
    // Initialize rankplus
    for(var level = 0; level< rankprobs.length; level++) {
        for(var rankIdx = 0; rankIdx < 6; rankIdx++) {
            window.lump.dun.probs.Normal.rank[`${rankIdx+1}+`][level] = 0;
        }
    }
    for(var level = 0; level< rankprobs.length; level++) {
        var cumeProb = 0;
        for(var rankIdx = 0; rankIdx < 6; rankIdx++) {
            rankAndLevelProb = parseFloat((rankprobs[level][rankIdx]/100.0).toFixed(4));
            window.lump.dun.probs.Normal.rank[rankIdx+1][level] = rankAndLevelProb;
            for(var plusRankIdx = rankIdx + 1; plusRankIdx < 6; plusRankIdx++) {
                window.lump.dun.probs.Normal.rank[`${plusRankIdx+1}+`][level] += rankAndLevelProb;
            }
            cumeProb += rankAndLevelProb;
        }
        window.lump.dun.probs.Normal.rank['any'].push(1);
    }
    // Properly round
    for(var level = 0; level< rankprobs.length; level++) {
        for(var rankIdx = 0; rankIdx < 6; rankIdx++) {
            window.lump.dun.probs.Normal.rank[`${rankIdx+1}+`][level] = parseFloat((1 - window.lump.dun.probs.Normal.rank[`${rankIdx+1}+`][level]).toFixed(4));
        }
    }
    window.lump.dun.probs.Normal.rarity = {
        Rare:[80.0,80.0,80.0,80.0,80.0,79.0,79.0,79.0,79.0,79.0,77.0,77.0,77.0,77.0,77.0,70.0,70.0,70.0,70.0,67.5,62.0,62.0,57.5,57.5,55],
        Epic:[19.00,19.00,19.00,19.00,19.00,19.50,19.50,19.50,19.50,19.50,20.00,20.00,20.00,20.00,20.00,25.00,25.00,25.00,25.00,25.00,29.00,28.00,31.50,30.50,32],
        Legendary:[1.00,1.00,1.00,1.00,1.00,1.50,1.50,1.50,1.50,1.50,3.00,3.00,3.00,3.00,3.00,5.00,5.00,5.00,5.00,7.50,9.00,10.00,11.00,12.00,13],
        Mythic:[],
        any:[],
        'Rare+':[],
        'Epic+':[],
        'Legendary+':[],
    };
    var raredata = window.lump.dun.probs.Normal.rarity;
    for(var i=0; i<25; i++) {
        raredata.Rare[i] = parseFloat((raredata.Rare[i]/100.0).toFixed(4));
        raredata.Epic[i] = parseFloat((raredata.Epic[i]/100.0).toFixed(4));
        raredata.Legendary[i] = parseFloat((raredata.Legendary[i]/100.0).toFixed(4));
        raredata.Mythic[i] = 0;
        raredata['Rare+'][i] = raredata.Rare[i] + raredata.Epic[i] + raredata.Legendary[i] + raredata.Mythic[i];
        raredata['Epic+'][i] = raredata.Epic[i] + raredata.Legendary[i] + raredata.Mythic[i];
        raredata['Legendary+'][i] = raredata.Legendary[i] + raredata.Mythic[i];
        raredata.any[i] =  parseFloat((raredata.Rare[i] + raredata.Epic[i] + raredata.Legendary[i] + raredata.Mythic[i]).toFixed(6));
    }
    window.lump.dun.probs.Normal.rarity = raredata;
    window.lump.dun.energy = [8,8,8,10,10,10,10,12,12,12,12,14,14,14,14,14,16,16,16,16,18,18,18,18,20];
    window.lump.dun.artifactprob = [0.794,0.798,0.802,0.806,0.81,0.814,0.818,0.822,0.826,0.83,0.834,0.838,0.842,0.846,0.85,0.995,0.995,0.995,0.995,0.995,0.995,0.995,0.995,0.995,0.995];
    console.log(window.lump.dun);
    // console.log($("#tabs-dungeons"));
    $("#art-type-select").val("any").change();
}

function lumpUpdateProbCells(what, r1, r2) {
    $("#"+what+"-ratio-cell").html(r1 + ":" + r2);
    val = 100*(r1/r2);
    $("#"+what+"-chance-cell").html(val.toFixed(1) + "%");
    return r1/r2;
}

function lumpRebuildSelect(what, allValues, availValues, exclude=[]) {
    var selectId = `#art-${what}-select`;
    var numId = `#art-${what}-num-cell`;
    var selectedVal = $(selectId).find(":selected").val() || 'any';
    if(! allValues.includes('any')) allValues.unshift('any');
    if(! availValues.includes('any')) availValues.unshift('any');
    var onlyOne = availValues.length - exclude.length == 2;
    if(onlyOne) {
        selectedVal = availValues[1];
    } else if(! availValues.includes(selectedVal) || exclude.includes(selectedVal)) {
        selectedVal = 'any';
    }
    var html = '';
    var availCount = 0;
    for(var i=0; i<allValues.length; i++) {
        var currentVal = allValues[i];
        var moreAttribs = '';
        if(! availValues.includes(currentVal) || (onlyOne && currentVal == 'any') || exclude.includes(currentVal)) {
            moreAttribs += ' disabled';
        } else {
            availCount += 1;
            if(currentVal == selectedVal) {
                moreAttribs += ' selected';
            }
        }
        html += `<option value="${currentVal}"${moreAttribs}>${currentVal}</option>`;
    }
    // console.log({func:'lumpRebuildSelect 2', what:what,selectedVal:selectedVal,allValues:allValues, availValues:availValues, exclude:exclude});
    $(`#art-${what}-select`).html(html);
    $(`#art-${what}-num-cell`).html(availCount);
    return [selectedVal, availCount];
}

function lumpPercent(num) {
    if(! num) return '-';
    num = num * 100.0;
    if(num >= 99.99) return num.toFixed(0) + '%';
    if(num >= 9.999) return num.toFixed(1) + '%';
    if(num >= 0.9999) return num.toFixed(2) + '%';
    if(num >= 0.09999) return num.toFixed(2) + '%';
    if(num >= 0.009999) return num.toFixed(3) + '%';
    if(num >= 0.0009999) return num.toFixed(4) + '%';
    if(num >= 0.0009999) return num.toFixed(5) + '%';
    return num.toFixed(6) + '%';
}

function lumpGetSelVal(what) {
    var select = $(`#art-${what}-select`);
    var val = select.find(":selected").val();
    var numAvail = 0;
    // Could not get this to work with $().each()
    var domSelect = document.getElementById(`art-${what}-select`);
    for(var i=0; i<domSelect.length; i++) {
        if(domSelect[i].disabled ||  domSelect[i].value == 'any') {
            // Dont count disabled or 'any'
        } else {
            numAvail ++;
        }
    }
    // $(`#art-${what}-select > option`).each(function(numAvail) {
    //     console.log({'this':this,'disabled':$(this).prop("disabled"),value:$(this).value});
    //     if($(this).prop("disabled") && $(this).value != 'any')
    //         numAvail += 1; });
    // console.log({'func':'lumpGetSelVal',what:what,numAvail:numAvail});
    $(`#art-${what}-num-cell`).html(numAvail);
    return [val ? val : 'any', numAvail];
}

function lumpUpdateProbsSelect(what) {
    switch (what.id) {
    case "art-type-select":
        // Need to "rebuild" the available stats.
        var allStats =window.lump.dun.artifacts.stats;
        var availStats = what.value == "any" ? allStats : window.lump.dun.artifacts.types[what.value];
        var [selectedVal, availCount] = lumpRebuildSelect("primary", allStats, availStats);
        var exclude = (selectedVal != 'any') ? [selectedVal] : [];
        console.log({exclude:exclude});
        lumpRebuildSelect("secondary", allStats, allStats, exclude);
        break;
    case "art-rank-select":
        lumpUpdateProbCells("rank", 1, what.value == "any" ? 1 : 6);
        break;
    case "art-rarity-select":
        lumpUpdateProbCells("rarity", 1, what.value == "any" ? 1 : 4);
        break;
    case "art-set-select":
        lumpUpdateProbCells("set", 1, what.value == "any" ? 1 : 9);
        break;
    case "art-primary-select":
        lumpUpdateProbCells("primary", 1, what.value == "any" ? 1 : window.lump.dun.nums.primaries);
        var exclude = (what.value != 'any') ? [what.value] : [];
        var allStats = window.lump.dun.artifacts.stats;
        console.log({exclude:exclude});
        lumpRebuildSelect("secondary", allStats, allStats, exclude);
        break;
    case "art-secondary-select":
        lumpUpdateProbCells("secondary", 1, what.value == "any" ? 1 : window.lump.dun.nums.primaries);
        break;
    case "art-multiplier-select":
        lumpUpdateProbCells("multiplier", parseInt(what.value), 1);
        break;
    default:
        console.log(['lumpUpdateProbsSelect ERROR',what, what.id, what.value]);
        alert("Doh!");
        break;
    }
    // Fill in the table...
    var html = '';
    var [rank, numrank] = lumpGetSelVal("rank");
    var [rarity, numrarity] = lumpGetSelVal("rarity");
    var [type, numtype] = lumpGetSelVal("type");
    var [set, numset] = lumpGetSelVal("set");
    var [primary, numprimary] = lumpGetSelVal("primary");
    var [secondary, numsecondary] = lumpGetSelVal("secondary");
    var [multiplier, nummultiplier] = lumpGetSelVal("multiplier");
    $("#pt1-type").html(type);
    $("#pt1-rank").html(rank);
    $("#pt1-rarity").html(rarity);
    $("#pt1-set").html(set);
    $("#pt1-primary").html(primary);
    $("#pt1-secondary").html(secondary);
    multiplier = set == 'any' ? 1 : parseFloat(multiplier);
    var runs = [1,2,3,10,100,1000,10000];
    var probPerLevel = [];
    for(var level = 0; level < window.lump.dun.probs.Normal.rarity.Rare.length; level ++) {
        var artProb = window.lump.dun.artifactprob[level];
        var typeProb = type == 'any' ? 1 : 1/6;
        var rankProb = window.lump.dun.probs.Normal.rank[rank][level];
        var rarityProb = window.lump.dun.probs.Normal.rarity[rarity][level];
        var setProb = (set == 'any' ? 1 : 1/9) * multiplier;
        var primaryProb = primary == 'any' || numprimary == 1 ? 1 : 1/numprimary;
        // console.log({primaryProb:primaryProb,numprimary:numprimary});
        // The probability of the secondary depends on the probability of the
        // primary. There are 11 possible stats for the secondary. If the
        // primary has only one option, then each secondary has a 1/10 chance
        // (one less than 11); however, if the primary has more than one option,
        // then the probability of getting a SPECIFIC secondary that was not the
        // primary is the probability of getting one of the primaries
        var secondaryProb = secondary == 'any' || numprimary == 1 ? 1 : 1/numsecondary;
        var prob = artProb * typeProb * rankProb * rarityProb * setProb * primaryProb * secondaryProb;
        probPerLevel[level] = prob;
        html += `<tr style="text-align:right">`;
        html += `<th>${level+1}</th>`;
        html += `<td style="text-align:right">${lumpPercent(artProb)}</td>`;
        html += `<td style="text-align:right">${lumpPercent(typeProb)}</td>`;
        html += `<td style="text-align:right">${lumpPercent(rankProb)}</td>`;
        html += `<td style="text-align:right">${lumpPercent(rarityProb)}</td>`;
        html += `<td style="text-align:right">${lumpPercent(setProb)}</td>`;
        html += `<td style="text-align:right">${lumpPercent(primaryProb)}</td>`;
        html += `<td style="text-align:right">${lumpPercent(secondaryProb)}</td>`;
        for(var i=0; i<runs.length; i++) {
            numRuns = runs[i];
            var runProb = 1 - (1 - prob)**(numRuns);
            html += `<td style="text-align:right">${lumpPercent(runProb)}</td>`;
        }
        html += '</tr>';
    }
    $("#art-prob-table-1").html(html);
    html = '';
    for(var level = 0; level < probPerLevel.length; level ++) {
        var levelProb = probPerLevel[level];
        if(levelProb) {
            var chanceNum = levelProb ? parseInt((1/levelProb).toFixed(0)) : 0;
            html += `<tr>`;
            html += `<th>${level+1}</th>`;
            html += `<td title="You have approximately a 1 in ${chanceNum.toLocaleString()} chance of getting the target artifact each time you run the dungeon on level ${level+1}">1:${chanceNum.toLocaleString()}</td>`;
            html += lumpArtResourcesCells(level + 1, 0.5, levelProb);
            html += lumpArtResourcesCells(level + 1, 0.75, levelProb);
            html += lumpArtResourcesCells(level + 1, 0.9, levelProb);
            html += `</tr>`;
        }
    }
    $("#art-resource-prob").html(html);
    // console.log(["lumpUpdateTypeProb", what, what.value, what.id]);
}

function lumpArtResourcesCells(level, targetProb, levelProb) {
    if(levelProb) {
        var html = '';
        var numRuns = lumpRunsForMinProb(targetProb, levelProb);
        var energyPerRun = window.lump.dun.energy[level -1];
        var addText = `to have at least a ${lumpPercent(targetProb)} chance of getting the target artifact on level ${level} of the dungeon.`;
        var [time, unitshort, units] = lumpFmtSecs(numRuns*30);
        html += `
<td
  style="text-align:right;border-left:1px solid black;"
  title="You'll need to run approximately ${numRuns.toLocaleString()} times ${addText}"
  >${numRuns.toLocaleString()}</td>
<td
  title="You'll need approximately ${(numRuns*energyPerRun).toLocaleString()} engergy ${addText}"
  >${(numRuns*energyPerRun).toLocaleString()}</td>
<td
  title="If you have no energy to start with, you'll need approximately ${(Math.ceil((numRuns*energyPerRun)/130)*40).toLocaleString()} gems, assuming 130 energy per refill, ${addText}"
  >${(Math.ceil((numRuns*energyPerRun)/130)*40).toLocaleString()}</td>
<td
  title="It will take you approximately ${time} ${units} of non-stop playing, assuming 30 seconds per run, ${addText}"
  >${time}${unitshort}</td>
`;
        return html;
    }
    return '<td></td><td></td><td></td><td></td>';
}

function lumpRunsForMinProb(targetProb, probPerRun) {
    return 1 + Math.floor(Math.log(1 - targetProb)/Math.log(1 - probPerRun));
}

function lumpToFixed(num, len = 2) {
    return parseFloat(num.toFixed(len));
}

function lumpFmtSecs(secs) {
    if(secs >= 31536000) return [lumpToFixed(secs/31536000).toLocaleString(), 'yrs', 'years'];
    if(secs >= 2629800) return [lumpToFixed(secs/2629800).toLocaleString(), 'mth', 'months'];
    if(secs >= 604800) return [lumpToFixed(secs/604800).toLocaleString(), 'wks', 'weeks'];
    if(secs >= 86400) return [lumpToFixed(secs/86400).toLocaleString(), 'day', 'days'];
    if(secs >= 3600) return [lumpToFixed(secs/3600).toLocaleString(), 'hrs', 'hours'];
    if(secs >= 60) return [lumpToFixed(secs/60).toLocaleString(), 'min', 'minutes'];
    return [secs.toLocaleString(), 'sec', 'seconds'];
}
