<?php

echo "Current directory: " . getcwd() . "<br>";

chdir(__DIR__);


// array of commands
$commands = array(
    'echo $PWD',
    'whoami',
    'git pull',
    'git status',
    'git submodule sync',
    'git submodule update',
    'git submodule status',
    'echo $PWD',
    'pm2 start server.js',
    'echo $PWD'
);

// Change directory using PHP
//didi


// Add remaining commands
// $commands[] = 'echo $PWD';
// $commands[] = 'pm2 start server.js';
// exec commands
$output = '';
foreach ($commands as $command) {
    $tmp = shell_exec($command);

    $output .= "<span style=\"color: #6BE234;\">\$</span><span style=\"color: #729FCF;\">{$command}\n</span><br />";
    $output .= htmlentities(trim($tmp)) . "\n<br /><br />";

    if ($tmp === false) {
        echo "Error executing command: $command";
        break;
    }
}
?>

<!DOCTYPE HTML>
<html lang="en-US">

<head>
    <meta charset="UTF-8">
    <title>GIT DEPLOYMENT SCRIPT</title>
</head>

<body style="background-color: #000000; color: #FFFFFF; font-weight: bold; padding: 0 10px;">
    <div style="width:700px">
        <div style="float:left;width:350px;">
            <p style="color:white;">Git Deployment Script</p>
            <?php echo $output; ?>
        </div>
    </div>
</body>

</html>