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

if (!majorVersions.includes("16")){
    jps.settings.main.fields[0].values.push({
        value: "16.20.2",
        caption: "16.20.2"
    });
    jps.settings.main.fields[0].values.push({
        value: "16.20.1",
        caption: "16.20.1"
    });
    jps.settings.main.fields[0].values.push({
        value: "16.20.0",
        caption: "16.20.0"
    });
}

jps.settings.main.fields[0].default = minorVersions[0];

if (jps.type == "install") {

    var resp = jelastic.env.control.GetEnvs();
    if (resp.result !== 0) return resp;
    let supportedNodeTypes = jps.targetNodes.nodeType;
    var envs = [], nodes = {}, stackVersion, envCaption;

    for (var i = 0, envInfo, env; envInfo = resp.infos[i]; i++) {
        env = envInfo.env;

    if (env.status == 1) {
        for (var j = 0, node; node = envInfo.nodes[j]; j++) {
            nodes[env.envName] = nodes[env.envName] || [];
            nodes[env.envName].groups = nodes[env.envName].groups || {};

            var stackVersion = node.version;

            if (supportedNodeTypes.indexOf(String(node.nodeType)) != -1) {
                if (!nodes[env.envName].groups[node.nodeGroup]) {
                    nodes[env.envName].push({
                        value: node.nodeGroup,
                        caption: node.name + ' (' + node.nodeGroup + ')'
                    }); 
                }
            }
 
            nodes[env.envName].groups[node.nodeGroup] = true;
        }

        if (nodes[env.envName] && nodes[env.envName].length > 0) {
            if ( typeof env.displayName !== 'undefined'  ) {
                envCaption = env.displayName + ' (' + env.envName + ')';
            } else {
                envCaption = env.envName;
        }
        envs.push({
            value: env.envName,
            caption: envCaption
        });
        }
      }
    }

    if (envs.length > 0) {
        jps.settings.main.fields[2].values = envs;
        jps.settings.main.fields[2].value = envs[0].value;
        jps.settings.main.fields[3].dependsOn.envName = nodes;
    }

    return { result: 0, settings: jps.settings };
} else {
    jps.settings.main.fields.push(
        {"type": "displayfield", "cls": "warning", "height": 30, "hideLabel": true, "markup": "The currently installed Node.js version is ${settings.minorVersion}."}
    )
    var old_distro_markup = "", baseUrl = jps.baseUrl;
    var checkDistroCmd = "wget -O /root/check_distro.sh " + baseUrl + "/scripts/check_distro.sh 2>/dev/null; bash /root/check_distro.sh"
    resp = api.env.control.ExecCmdById('${env.envName}', session, '${globals.masterId}', toJSON([{ command: checkDistroCmd }]), true, "root");
    if (resp.result !== 0) return resp;
    if (resp.responses[0].out == "Non-supported") {
        old_distro_markup = "Node.js versions newer than 16 cannot be chosen for the current layer, as they need an OS distribution with glibc 2.28 or higher."
        jps.settings.main.fields[0].values = [{"value":"16.20.2","caption":"16.20.2"},{"value":"16.20.1","caption":"16.20.1"},{"value":"16.20.0","caption":"16.20.0"}];
        jps.settings.main.fields.push(
            {"type": "displayfield", "cls": "warning", "height": 30, "hideLabel": true, "markup": old_distro_markup}
        )
    }
    jps.settings.main.fields[0].default = '${settings.minorVersion}';
    return settings;
}
