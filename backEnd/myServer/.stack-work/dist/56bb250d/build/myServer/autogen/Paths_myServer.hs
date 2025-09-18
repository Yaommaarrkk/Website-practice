{-# LANGUAGE CPP #-}
{-# LANGUAGE NoRebindableSyntax #-}
#if __GLASGOW_HASKELL__ >= 810
{-# OPTIONS_GHC -Wno-prepositive-qualified-module #-}
#endif
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
{-# OPTIONS_GHC -w #-}
module Paths_myServer (
    version,
    getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir,
    getDataFileName, getSysconfDir
  ) where


import qualified Control.Exception as Exception
import qualified Data.List as List
import Data.Version (Version(..))
import System.Environment (getEnv)
import Prelude


#if defined(VERSION_base)

#if MIN_VERSION_base(4,0,0)
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#else
catchIO :: IO a -> (Exception.Exception -> IO a) -> IO a
#endif

#else
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#endif
catchIO = Exception.catch

version :: Version
version = Version [0,1,0,0] []

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir `joinFileName` name)

getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath




bindir, libdir, dynlibdir, datadir, libexecdir, sysconfdir :: FilePath
bindir     = "D:\\coding\\encoding\\httpServer\\fileUpload_2\\backEnd\\myServer\\.stack-work\\install\\bec32a26\\bin"
libdir     = "D:\\coding\\encoding\\httpServer\\fileUpload_2\\backEnd\\myServer\\.stack-work\\install\\bec32a26\\lib\\x86_64-windows-ghc-9.10.2-cea6\\myServer-0.1.0.0-EsAYy1ifCFQmlOyBoO75z-myServer"
dynlibdir  = "D:\\coding\\encoding\\httpServer\\fileUpload_2\\backEnd\\myServer\\.stack-work\\install\\bec32a26\\lib\\x86_64-windows-ghc-9.10.2-cea6"
datadir    = "D:\\coding\\encoding\\httpServer\\fileUpload_2\\backEnd\\myServer\\.stack-work\\install\\bec32a26\\share\\x86_64-windows-ghc-9.10.2-cea6\\myServer-0.1.0.0"
libexecdir = "D:\\coding\\encoding\\httpServer\\fileUpload_2\\backEnd\\myServer\\.stack-work\\install\\bec32a26\\libexec\\x86_64-windows-ghc-9.10.2-cea6\\myServer-0.1.0.0"
sysconfdir = "D:\\coding\\encoding\\httpServer\\fileUpload_2\\backEnd\\myServer\\.stack-work\\install\\bec32a26\\etc"

getBinDir     = catchIO (getEnv "myServer_bindir")     (\_ -> return bindir)
getLibDir     = catchIO (getEnv "myServer_libdir")     (\_ -> return libdir)
getDynLibDir  = catchIO (getEnv "myServer_dynlibdir")  (\_ -> return dynlibdir)
getDataDir    = catchIO (getEnv "myServer_datadir")    (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "myServer_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "myServer_sysconfdir") (\_ -> return sysconfdir)



joinFileName :: String -> String -> FilePath
joinFileName ""  fname = fname
joinFileName "." fname = fname
joinFileName dir ""    = dir
joinFileName dir fname
  | isPathSeparator (List.last dir) = dir ++ fname
  | otherwise                       = dir ++ pathSeparator : fname

pathSeparator :: Char
pathSeparator = '\\'

isPathSeparator :: Char -> Bool
isPathSeparator c = c == '/' || c == '\\'
