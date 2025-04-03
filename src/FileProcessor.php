<?php

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Path;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
class FileProcessor {
    public const FOLDER_PATH = __DIR__."/../var/media";
    private $name, $mimeType, $extension;
    public function __construct(private UploadedFile|File $file) {
        $count = (new Finder())->files()->in(self::FOLDER_PATH)->count();
        $this->name = md5($file->getBasename().strval($count));
        $this->mimeType = $file->getMimeType();
        $this->extension = $file->getExtension();
    }
    public static function upload(UploadedFile|File $file, bool $copy = false):static {
        $processor = new FileProcessor($file);
        $filesystem = new Filesystem();
        if ($copy)
            $filesystem->copy($file->getPathname(),self::FOLDER_PATH.'/'.$processor->getName().'.'.$processor->getExtension());
        else
            $file->move(self::FOLDER_PATH,$processor->getName().'.'.$processor->getExtension());
        return $processor;
    }
    public static function get($uri): static {
        $path = Path::normalize(self::FOLDER_PATH.'/'.$uri);
        $file = new File($path);
        
        return new FileProcessor($file);
    }

    
    public function getFile() {return $this->file;}
    public function getName() {return $this->name;}
    public function getMime() {return $this->mimeType;}
    public function getExtension() {return $this->extension;}
}