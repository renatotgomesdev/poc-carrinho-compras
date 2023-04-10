<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit538f8b255b327e4abef9cb2b84d651e6
{
    public static $prefixLengthsPsr4 = array (
        'A' => 
        array (
            'App\\' => 4,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'App\\' => 
        array (
            0 => __DIR__ . '/../..' . '/app',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit538f8b255b327e4abef9cb2b84d651e6::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit538f8b255b327e4abef9cb2b84d651e6::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit538f8b255b327e4abef9cb2b84d651e6::$classMap;

        }, null, ClassLoader::class);
    }
}
