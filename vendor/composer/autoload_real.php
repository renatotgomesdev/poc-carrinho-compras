<?php

// autoload_real.php @generated by Composer

class ComposerAutoloaderInit538f8b255b327e4abef9cb2b84d651e6
{
    private static $loader;

    public static function loadClassLoader($class)
    {
        if ('Composer\Autoload\ClassLoader' === $class) {
            require __DIR__ . '/ClassLoader.php';
        }
    }

    /**
     * @return \Composer\Autoload\ClassLoader
     */
    public static function getLoader()
    {
        if (null !== self::$loader) {
            return self::$loader;
        }

        spl_autoload_register(array('ComposerAutoloaderInit538f8b255b327e4abef9cb2b84d651e6', 'loadClassLoader'), true, true);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader(\dirname(__DIR__));
        spl_autoload_unregister(array('ComposerAutoloaderInit538f8b255b327e4abef9cb2b84d651e6', 'loadClassLoader'));

        require __DIR__ . '/autoload_static.php';
        call_user_func(\Composer\Autoload\ComposerStaticInit538f8b255b327e4abef9cb2b84d651e6::getInitializer($loader));

        $loader->register(true);

        return $loader;
    }
}