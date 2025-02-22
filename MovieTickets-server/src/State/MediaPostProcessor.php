<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\RequestStack;

class MediaPostProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly RequestStack $request,
        #[Autowire(service: "api_platform.doctrine.orm.state.persist_processor")]
        private ProcessorInterface $processor,
    ) {}
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $file = $this->request->getCurrentRequest()->files->get('media');
        $name = $file->getClientOriginalName();
        $mimeType = $file->getMimeType();
        $file->move(__DIR__."/../../var/media",$name);
        
        $data->setUri($name);
        $data->setContentType($mimeType);
        return $this->processor->process($data,$operation,$uriVariables,$context);
    }
}
