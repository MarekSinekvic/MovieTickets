<?php

namespace App\State;

use ApiPlatform\Doctrine\Common\State\RemoveProcessor;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Filesystem;

class MovieDeleteProcessor implements ProcessorInterface
{
    public function __construct(
        // private readonly RequestStack $request,
        private Filesystem $filesystem,
        #[Autowire(service: RemoveProcessor::class)] private ProcessorInterface $removeProcessor,
    ) {
        $this->filesystem = $filesystem;
    }
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        // error_log(var_export($data->getMedia(), true));
        foreach ($data->getMedia() as $media) {
            // error_log(var_export($media, true));
            $path = __DIR__."/../../var/media/".$media->getUri();
            if ($this->filesystem->exists($path))
                $this->filesystem->remove($path);
        }
        $this->removeProcessor->process($data,$operation,$uriVariables,$context);
    }
}
