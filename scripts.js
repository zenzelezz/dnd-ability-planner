window.addEventListener("load", (load_event) => {
    const abilities = [
        "strength",
        "dexterity",
        "constitution",
        "intelligence",
        "wisdom",
        "charisma"
    ];

    const skills = [
        [ "acrobatics",      "dexterity"    ],
        [ "animal-handling", "wisdom"       ],
        [ "arcana",          "intelligence" ],
        [ "athletics",       "strength"     ],
        [ "deception",       "charisma"     ],
        [ "history",         "intelligence" ],
        [ "insight",         "wisdom"       ],
        [ "intimidation",    "charisma"     ],
        [ "investigation",   "intelligence" ],
        [ "medicine",        "wisdom"       ],
        [ "nature",          "intelligence" ],
        [ "perception",      "wisdom"       ],
        [ "performance",     "charisma"     ],
        [ "persuasion",      "charisma"     ],
        [ "religion",        "intelligence" ],
        [ "sleight-of-hand", "dexterity"    ],
        [ "stealth",         "dexterity"    ],
        [ "survival",        "wisdom"       ]
    ];

    const tools = [
        "artisans-tools",
        "disguise-kit",
        "forgery-kit",
        "gaming-set",
        "herbalism-kit",
        "musical-instrument",
        "navigators-tools",
        "poisoners-kit",
        "thieves-tools"
    ];

    const passives = [
        "perception",
        "investigation",
        "insight"
    ];

    function getById(e) {
        return document.getElementById(e);
    }

    function element(e) {
        if (typeof e === "string") {
            return getById(e);
        }

        return e;
    }

    function intValue(e) {
        return parseInt(element(e).value);
    }

    function getText(e) {
        return element(e).innerHTML
    }

    function setText(e, text) {
        element(e).innerHTML = text;
    }

    function setStyle(e, style, value) {
        element(e).style[style] = value;
    }

    function updateValues(e) {
        // Level
        var level = intValue("level");

        // Proficiency
        var proficiency = 1 + Math.ceil(level / 4);
        getById("proficiency").innerHTML = proficiency;

        // Ability scores
        var dice_sum = 0;

        abilities.forEach(function(ability) {
            var dice_score  = intValue("base-"  + ability)
            var race_score  = intValue("race-"  + ability)
            var extra_score = intValue("extra-" + ability)
            var total_score = dice_score + race_score + extra_score;
            var modifier = Math.floor((total_score - 10) / 2);

            dice_sum += dice_score;

            setText( "total-" + ability, total_score);
            setStyle("total-" + ability, "color", (total_score > 20 ? "#f00" : "#000"));
            setText( "modifier-" + ability, modifier);
            setStyle("modifier-" + ability, "color", (modifier < 0 ? "#f00" : "#000"));
        });

        setText("dice-sum", dice_sum);
        setText("remainder-72", 72 - dice_sum);
        setText("remainder-76", 76 - dice_sum);
        setText("remainder-80", 80 - dice_sum);

        // Skills
        skills.forEach(function(skill) {
            var skill_name             = skill[0];
            var skill_type             = skill[1];
            var proficiency_multiplier = intValue("skill-" + skill_name);
            var ability_modifier       = parseInt(getText("modifier-" + skill_type));
            var skill_score            = ability_modifier + (proficiency * proficiency_multiplier);

            setText("skill-" + skill_name + "-score", skill_score);
            setText("skill-" + skill_name + "-range", Math.max(1, 1 + skill_score) + "-" + (20 + skill_score));
        });

        // Passives
        passives.forEach(function(skill) {
            skill_value = 10 + parseInt(getText("skill-" + skill + "-score"));

            if (skill[0] == "i" && getById("observant").checked) {
                skill_value += 5;
            }

            setText("passive-" + skill, skill_value);
        });

        // Tools
        tools.forEach(function(tool) {
            var proficiency_multiplier = intValue("tool-" + tool);
            var tool_score = (proficiency * proficiency_multiplier);
            setText("tool-" + tool + "-score", tool_score);
            setText("tool-" + tool + "-range", Math.max(1, 1 + tool_score) + "-" + (20 + tool_score));
        });
    }

    ["input", "select"].forEach(function(element_type) {
        Array.from(document.getElementsByTagName(element_type)).forEach(function(element) {
            element.addEventListener("change", updateValues);
        });
    });
});
