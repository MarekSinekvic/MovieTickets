<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Path;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Attribute\Route;

class MediaController extends AbstractController
{
    #[Route('/media/show/{name}', name: 'show_media')]
    public function index(string $name): BinaryFileResponse
    {
        $path = Path::normalize(__DIR__."/../../var/media/".$name);
        $file = new File($path);
        
        $res = new BinaryFileResponse($path,headers: [
            'Cache-Control' => 'private',
            'Content-Type' => $file->getMimeType()
        ]);
        $res->headers->set('Content-Disposition', $res->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT,$file->getFilename()));
        
        return $res;
    }
    #[Route('/media/upload',name:'create_media',methods:['post'])]
    public function create(Request $req):Response {
        $files = $req->files->get('images');
        $upload = function ($f) {
            $name = $f->getClientOriginalName();
            $f->move(__DIR__."/../../var/media",$name);
        };
        if (is_array($files)) {
            foreach ($files as $file) {
                $upload($file);
            }
        } else $upload($files);
        
        return new Response();
    }
}
