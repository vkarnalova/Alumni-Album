function fillInFieldsWithInformation(data) {
    var name = data.firstName;
    var familyName = data.familyName;
    var fullName = capitaliseFirstLetter(name) + " " + capitaliseFirstLetter(familyName);
    fillInNonNullField("fullName", fullName);

    var major = data.major;
    fillInNonNullField("majorAndClass", major);
    document.getElementById("majorAndClass").innerHTML += "\"";

    var classOf = data.class;
    document.getElementById("majorAndClass").innerHTML += ", випуск ";
    fillInNonNullField("majorAndClass", classOf);
    document.getElementById("majorAndClass").innerHTML += "г.";

    var potok = data.potok;
    fillInField("potok", potok);

    var groupNumber = data.groupNumber;
    fillInField("groupNumber", groupNumber);

    var phoneNumber = data.phoneNumber;
    fillInField("phoneNumber", phoneNumber);

    var address = data.address;
    fillInField("address", address);

    var additionalInfo = data.additionalInfo;
    fillInField("additionalInfo", additionalInfo);
}

function fillInNonNullField(fieldId, value) {
    document.getElementById(fieldId).innerHTML += value;
}

function capitaliseFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
}

function fillInField(fieldId, value) {
    if(value != null) {
        document.getElementById(fieldId).innerHTML += value;
    } else {
        document.getElementById(fieldId).innerHTML = "";
    }
}