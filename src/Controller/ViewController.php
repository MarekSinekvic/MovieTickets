<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ViewController extends AbstractController
{
    #[Route('/', name: 'app_view')]
    public function index(): Response
    {
        return $this->render('view/index.html.twig', [
        ]);
    }
}
