<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class UserGetMeProvider implements ProviderInterface
{
    public function __construct(
        #[Autowire(service: Security::class)]
        private Security $security
    )
    {}
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $loggedUser = $this->security->getUser();
        return $loggedUser;
    }
}
