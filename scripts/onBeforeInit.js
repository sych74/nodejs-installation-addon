resp=api.environment.control.GetTemplates();
if (resp.result !== 0) return resp;
for (var i = 0, n = resp.array.length; i < n; i++) {
    if ( resp.array[i].nodeType == "nodejs" ) {
        const nodejsAliases = resp.array[i].nodeTypeAliases.map(item => item.substring(6, 8))
        majorVersions = nodejsAliases.filter((value, index, array) => nodejsAliases.indexOf(value) === index).sort();
        var minorVersionsList = [];
        for (var j = 0, m = resp.array[i].tags.length; j < m; j++) {
            tag = resp.array[i].tags[j].name;
            minorVersion = tag.substring(0, tag.indexOf('-'));
            minorVersionsList.push(minorVersion);
            minorVersionsSorted = minorVersionsList.filter((value, index, array) => minorVersionsList.indexOf(value) === index).sort();
            minorVersions = minorVersionsSorted.reverse();
        }
    }
}

jps.settings.main.fields[0].values = [];

for (var j = 0, m = minorVersions.length; j < m; j++) {
    jps.settings.main.fields[0].values.push({
        value: minorVersions[j],
        caption: minorVersions[j]
    })
}

var envName = env.envName;
var masterId = null;

var targetNodeGroup = typeof targetNodes !== 'undefined' && targetNodes.nodeGroup ? targetNodes.nodeGroup : null;
if (!targetNodeGroup && settings.nodeGroups) {
    targetNodeGroup = Array.isArray(settings.nodeGroups) ? settings.nodeGroups[0] : settings.nodeGroups;
}

if (targetNodeGroup) {
    var envResp = jelastic.env.control.GetEnvInfo(envName);
    if (envResp.result === 0 && envResp.nodes && envResp.nodes.length > 0) {
        // Ищем ноду из нужной группы
        for (var k = 0; k < envResp.nodes.length; k++) {
            if (envResp.nodes[k].nodeGroup === targetNodeGroup) {
                var nodeId = envResp.nodes[k].id;
                var cmdResp = api.env.control.ExecCmdById(envName, session, nodeId, toJSON([{ command: "source /.jelenv; echo ${MASTER_ID}" }]), true, "root");
                if (cmdResp.result === 0 && cmdResp.responses && cmdResp.responses[0] && cmdResp.responses[0].out) {
                    masterId = cmdResp.responses[0].out.trim();
                    break;
                }
            }
        }
    }
}

if (settings.minorVersion) {
    jps.settings.main.fields.push(
        {"type": "displayfield", "cls": "warning", "height": 30, "hideLabel": true, "markup": "The currently installed Node.js version is ${settings.minorVersion}."}
    )
}

var old_distro_markup = "", baseUrl = jps.baseUrl;

if (masterId) {
    var checkDistroCmd = "wget -O /root/check_distro.sh " + baseUrl + "/scripts/check_distro.sh 2>/dev/null; bash /root/check_distro.sh"
    resp = api.env.control.ExecCmdById(envName, session, masterId, toJSON([{ command: checkDistroCmd }]), true, "root");
    if (resp.result !== 0) {
        resp = { result: 0, responses: [{ out: "" }] };
    }
    if (resp.responses && resp.responses[0] && resp.responses[0].out == "Non-supported") {
        old_distro_markup = "Node.js versions newer than 16 cannot be chosen for the current layer, as they need an OS distribution with glibc 2.28 or higher."
        jps.settings.main.fields[0].values = [{"value":"16.20.2","caption":"16.20.2"},{"value":"16.20.1","caption":"16.20.1"},{"value":"16.20.0","caption":"16.20.0"}];
        jps.settings.main.fields.push(
            {"type": "displayfield", "cls": "warning", "height": 30, "hideLabel": true, "markup": old_distro_markup}
        )
    }
}

if (settings.minorVersion) {
    jps.settings.main.fields[0].default = '${settings.minorVersion}';
}

return settings;
