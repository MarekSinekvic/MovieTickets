<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class MoviePatchProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly RequestStack $request,
        private Filesystem $filesystem,
        #[Autowire(service: "api_platform.doctrine.orm.state.persist_processor")]
        private ProcessorInterface $processor,
    ) {
        $this->filesystem = $filesystem;
    }
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        foreach ($data->getMedia() as $media) {
            // error_log(var_export($media, true));
            $path = __DIR__."/../../var/media/".$media->getUri();
            if ($this->filesystem->exists($path))
                $this->filesystem->remove($path);
        }

        $file = $this->request->getCurrentRequest()->files->get('media');
        $name = $file->getClientOriginalName();
        $mimeType = $file->getMimeType();
        $file->move(__DIR__."/../../var/media",$name);
        
        $data->setUri($name);
        $data->setContentType($mimeType);

        return $this->processor->process($data,$operation,$uriVariables,$context);
    }
}
