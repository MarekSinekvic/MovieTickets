<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Faker\Factory;


class UserFixture extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $hasher
    )
    {
    }
    public function load(ObjectManager $manager): void
    {
        $user = new User();
        
        $user->setUuid("Admin");
        $user->setRoles(["ROLE_USER",'ROLE_ADMIN']);
        $user->setEmail("admin@admin.com");
        $user->setPassword($this->hasher->hashPassword($user, "admin"));
        
        $manager->persist($user);

        $faker = Factory::create();
        for ($i = 0; $i < 100; $i++) {
            $user = new User();
            $user->setUuid($faker->userName());
            $user->setRoles(["ROLE_USER"]);
            $user->setPassword($this->hasher->hashPassword($user, $faker->password()));
            $user->setEmail($faker->email());
            $manager->persist($user);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
        ];
    }
}
