<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserPostProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $processor,
        private UserPasswordHasherInterface $passwordHasher
    )
    {
    }
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): User
    {
        // error_log(strval($data));
        if (!$data->getPassword()) {
            return $this->processor->process($data, $operation, $uriVariables, $context);
        }

        $hashedPassword = $this->passwordHasher->hashPassword(
            $data,
            $data->getPassword()
        );
        $data->setPassword($hashedPassword);
        $data->setPlainPassword($data->getPassword());
        // $data->setRoles(json_decode($data->getRoles()));
        // $data->eraseCredentials();

        return $this->processor->process($data, $operation, $uriVariables, $context);
    }
}
