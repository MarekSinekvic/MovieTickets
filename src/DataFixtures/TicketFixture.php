<?php

namespace App\DataFixtures;

use App\Entity\Ticket;
use App\Repository\ShowRepository;
use App\Repository\UserRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class TicketFixture extends Fixture implements DependentFixtureInterface
{
    public function __construct(
        private UserRepository $userRepository,
        private ShowRepository $showRepository
    )
    {
    }
    public function load(ObjectManager $manager): void
    {
        $users = $this->userRepository->findAll();
        $shows = $this->showRepository->findAll();
        for ($i = 0; $i < 30*random_int(30,100); $i++) {
            $ticket = new Ticket();
            $ticket->setClient($users[random_int(0,count($users)-1)]);
            $ticket->setShow($shows[random_int(0,count($shows)-1)]);
            $ticket->setSeat(1);
            $manager->persist($ticket);
        }

        $manager->flush();
    }
    public function getDependencies(): array
    {
        return [
            ShowFixture::class
        ];
    }
}
