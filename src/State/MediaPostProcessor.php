<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use FileProcessor;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\RequestStack;

class MediaPostProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly RequestStack $request,
        #[Autowire(service: "api_platform.doctrine.orm.state.persist_processor")]
        private ProcessorInterface $processor,
    ) {}
    /** @var \App\Entity\Media $data*/
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        /** @var UploadedFile */
        $file = $this->request->getCurrentRequest()->files->get('media');
        $data->uploadFile($file);
        return $this->processor->process($data,$operation,$uriVariables,$context);
    }
}
