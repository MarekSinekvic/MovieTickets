<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Path;
use Symfony\Component\HttpFoundation\File\File;

class MediaGetProvider implements ProviderInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.item_provider')]
        private ProviderInterface $provider
    )
    {}
    private array $data;
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $media = $this->provider->provide($operation,$uriVariables,$context);
        if (!$media) return null;

        error_log(var_export($uriVariables,true));
        $path = Path::normalize(__DIR__."/../../var/media/".$media->getUri());
        $file = new File($path);
        $media->setFile($file);

        return $media;
    }
}
