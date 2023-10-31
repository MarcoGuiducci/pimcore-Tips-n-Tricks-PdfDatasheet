<?php

namespace App\Controller\Admin;


use Symfony\Component\HttpFoundation\Request;
use Pimcore\Bundle\AdminBundle\Controller\AdminAbstractController;
use Pimcore\Bundle\ApplicationLoggerBundle\ApplicationLogger;
use Pimcore\Model\DataObject\Product;
use Pimcore\Tool;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Twig\Environment;

/**
 * @Route("/admin/product")
 */
class ProductController extends AdminAbstractController
{
    /**
     * @var ApplicationLogger
     */
    protected $logger;
    
    /**
     * @var Environment
     */
    protected $twig;

    public function __construct(Environment $twig)
    {
        $this->twig = $twig;
        $this->logger = ApplicationLogger::getInstance();
    }

    /**
     * @Route("/download-product-sheet")
     */
    public function downloadTechnicalSheet(Request $request)
    {
        ini_set("memory_limit", "4096M");

        $objectId = $request->get("objectId");
        $language = $request->get("language") ?? "en";

        $product = Product::getById($objectId);

        if(empty($product)){
            throw new \Exception("Product with id '$objectId' not found.");
        }

        $html = $this->twig->render(
            'product/view.html.twig',
            $this->getProductData($product, $language)
        );
    

        $params = [
        ];
        
        $pdf = \Pimcore\Bundle\WebToPrintBundle\Processor::getInstance()->getPdfFromString($html, $params);

        return new Response(
            $pdf,
            200,
            array(
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="'.$product->getSku().'.pdf"'
            )
        );
    }

    private function getProductData(Product $product, $language): array
    {
        $data = [
            "locale" => $language,
            "product" => [
                "sku" => $product->getSku(),
                "title" => $product->getTitle($language),
                "description" => $product->getDescription($language),
                "image" => "http://nginx".$product->getImage()->getFullPath(),
                "availableSize" => implode(", ",$product->getAvailableSize()),
                "price" => $product->getPrice()->__toString(),
                "composition" => $product->getComposition($language)
            ]
        ];

        return $data;
    }
}
