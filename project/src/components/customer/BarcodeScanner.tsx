import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScanLine,
  Camera,
  CameraOff,
  Search,
  Plus,
  Package,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Keyboard,
} from 'lucide-react';

import { BarcodeDetector } from 'barcode-detector';

import { supabase } from '../../lib/supabase';
import { Product } from '../../lib/types';

declare global {
  interface Window {
    BarcodeDetector: any;
  }
}

interface BarcodeScannerProps {
  storeId: string;
  onAddToCart: (product: Product) => void;
  cartProductIds: string[];
}

type ScanMode = 'camera' | 'manual';

function getDaysUntilExpiry(expiryDate: string | null): number | null {
  if (!expiryDate) return null;

  return Math.ceil(
    (new Date(expiryDate).getTime() - Date.now()) / 86400000
  );
}

const SAMPLE_PRODUCTS: Record<string, Product[]> = {
  '1': [
    {
      id: 'sample-1',
      store_id: '1',
      barcode: '8901234567890',
      name: 'Whole Wheat Bread',
      description: 'Freshly baked whole wheat loaf',
      price: 3.49,
      category: 'Bakery',
      stock_quantity: 50,
      manufacturing_date: '2026-04-08',
      expiry_date: '2026-04-15',
      image_url: '',
      created_at: new Date().toISOString(),
    },
      {
        id: 'sample-2',
        store_id: '1',
        barcode: '8902345678901',
        name: 'Full Cream Milk 1L',
        description: 'Farm fresh pasteurized milk',
        price: 1.99,
        category: 'Dairy',
        stock_quantity: 120,
        manufacturing_date: '2026-04-10',
        expiry_date: '2026-04-17',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-delhi-1',
        store_id: '1',
        barcode: '8903345678901',
        name: 'Basmati Rice 2kg',
        description: 'Premium long grain basmati',
        price: 8.99,
        category: 'Grocery',
        stock_quantity: 75,
        manufacturing_date: '2026-03-10',
        expiry_date: '2027-03-10',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-delhi-2',
        store_id: '1',
        barcode: '8904345678901',
        name: 'Sunflower Oil 1L',
        description: 'Pure vegetable cooking oil',
        price: 4.99,
        category: 'Oils',
        stock_quantity: 100,
        manufacturing_date: '2026-02-15',
        expiry_date: '2027-02-15',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-delhi-3',
        store_id: '1',
        barcode: '8905345678901',
        name: 'Sugar 1kg',
        description: 'Pure refined sugar',
        price: 2.49,
        category: 'Grocery',
        stock_quantity: 150,
        manufacturing_date: '2026-03-01',
        expiry_date: '2027-03-01',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-delhi-4',
        store_id: '1',
        barcode: '8906345678901',
        name: 'Green Tea 250g',
        description: 'Organic green tea leaves',
        price: 7.99,
        category: 'Beverages',
        stock_quantity: 40,
        manufacturing_date: '2026-03-05',
        expiry_date: '2027-03-05',
        image_url: '',
        created_at: new Date().toISOString(),
      },
    ],

    '2': [
      {
        id: 'sample-3',
        store_id: '2',
        barcode: '8910123456789',
        name: 'Masala Chai 1kg',
        description: 'Premium Indian tea masala blend',
        price: 5.99,
        category: 'Beverages',
        stock_quantity: 80,
        manufacturing_date: '2026-03-20',
        expiry_date: '2027-03-20',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-smart-1',
        store_id: '2',
        barcode: '8920234567890',
        name: 'Fresh Paneer 500g',
        description: 'Homemade cottage cheese',
        price: 4.99,
        category: 'Dairy',
        stock_quantity: 65,
        manufacturing_date: '2026-04-10',
        expiry_date: '2026-04-18',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-smart-2',
        store_id: '2',
        barcode: '8921234567890',
        name: 'Yogurt 500ml',
        description: 'Fresh plain yogurt',
        price: 2.29,
        category: 'Dairy',
        stock_quantity: 95,
        manufacturing_date: '2026-04-11',
        expiry_date: '2026-04-18',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-smart-3',
        store_id: '2',
        barcode: '8922234567890',
        name: 'Black Pepper 100g',
        description: 'Ground black pepper',
        price: 4.99,
        category: 'Spices',
        stock_quantity: 50,
        manufacturing_date: '2026-03-10',
        expiry_date: '2027-03-10',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-smart-4',
        store_id: '2',
        barcode: '8923234567890',
        name: 'Coriander Seeds 100g',
        description: 'Whole coriander seeds',
        price: 3.49,
        category: 'Spices',
        stock_quantity: 60,
        manufacturing_date: '2026-03-12',
        expiry_date: '2027-03-12',
        image_url: '',
        created_at: new Date().toISOString(),
      },
    ],

    '3': [
      {
        id: 'sample-4',
        store_id: '3',
        barcode: '8911123456789',
        name: 'Atta Flour 5kg',
        description: 'Whole wheat flour',
        price: 12.49,
        category: 'Grocery',
        stock_quantity: 90,
        manufacturing_date: '2026-03-15',
        expiry_date: '2027-03-15',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-vmart-1',
        store_id: '3',
        barcode: '8930345678901',
        name: 'Soya Chunks 200g',
        description: 'High-protein soya nuggets',
        price: 2.79,
        category: 'Grocery',
        stock_quantity: 120,
        manufacturing_date: '2026-03-25',
        expiry_date: '2027-03-25',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-vmart-2',
        store_id: '3',
        barcode: '8931345678901',
        name: 'Chickpeas 1kg',
        description: 'Dried chickpeas',
        price: 3.99,
        category: 'Grocery',
        stock_quantity: 85,
        manufacturing_date: '2026-03-20',
        expiry_date: '2027-03-20',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-vmart-3',
        store_id: '3',
        barcode: '8932345678901',
        name: 'Kidney Beans 1kg',
        description: 'Premium kidney beans',
        price: 4.49,
        category: 'Grocery',
        stock_quantity: 70,
        manufacturing_date: '2026-03-22',
        expiry_date: '2027-03-22',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-vmart-4',
        store_id: '3',
        barcode: '8933345678901',
        name: 'Poha 500g',
        description: 'Beaten rice (poha)',
        price: 2.99,
        category: 'Grains',
        stock_quantity: 110,
        manufacturing_date: '2026-03-18',
        expiry_date: '2027-03-18',
        image_url: '',
        created_at: new Date().toISOString(),
      },
    ],

    '4': [
      {
        id: 'sample-mumbai-1',
        store_id: '4',
        barcode: '8940456789012',
        name: 'Coconut Oil 1L',
        description: 'Pure cold-pressed coconut oil',
        price: 6.99,
        category: 'Oils',
        stock_quantity: 60,
        manufacturing_date: '2026-02-15',
        expiry_date: '2027-02-15',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-mumbai-2',
        store_id: '4',
        barcode: '8941456789012',
        name: 'Turmeric Powder 100g',
        description: 'Pure ground turmeric',
        price: 3.49,
        category: 'Spices',
        stock_quantity: 100,
        manufacturing_date: '2026-03-01',
        expiry_date: '2027-03-01',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-mumbai-3',
        store_id: '4',
        barcode: '8942456789012',
        name: 'Mustard Seeds 100g',
        description: 'Whole mustard seeds',
        price: 2.99,
        category: 'Spices',
        stock_quantity: 80,
        manufacturing_date: '2026-03-02',
        expiry_date: '2027-03-02',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-mumbai-4',
        store_id: '4',
        barcode: '8943456789012',
        name: 'Fenugreek 100g',
        description: 'Methi seeds',
        price: 3.29,
        category: 'Spices',
        stock_quantity: 65,
        manufacturing_date: '2026-03-03',
        expiry_date: '2027-03-03',
        image_url: '',
        created_at: new Date().toISOString(),
      },
      {
        id: 'sample-mumbai-5',
        store_id: '4',
        barcode: '8944456789012',
        name: 'Jaggery 500g',
        description: 'Organic jaggery block',
        price: 4.99,
        category: 'Sweeteners',
        stock_quantity: 45,
        manufacturing_date: '2026-02-20',
        expiry_date: '2027-02-20',
        image_url: '',
        created_at: new Date().toISOString(),
      },
    ],
};

function getSampleProducts(storeId: string): Product[] {
  return SAMPLE_PRODUCTS[storeId] ?? [];
}

export function BarcodeScanner({
  storeId,
  onAddToCart,
  cartProductIds,
}: BarcodeScannerProps) {
  const [mode, setMode] = useState<ScanMode>('camera');
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [scanning, setScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const animFrameRef = useRef<number>(0);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);

    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;

    setScanning(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const lookupBarcode = useCallback(
    async (code: string) => {
      setNotFound(false);
      setProduct(null);

      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('barcode', code)
        .maybeSingle();

      if (data) {
        setProduct(data);
      } else {
        const sampleProducts = getSampleProducts(storeId);

        const sampleProduct = sampleProducts.find(
          (item) => item.barcode === code
        );

        if (sampleProduct) {
          setProduct(sampleProduct);
        } else {
          setNotFound(true);
        }
      }
    },
    [storeId]
  );

  const scanFrame = useCallback(async () => {
    if (!videoRef.current || !detectorRef.current) return;

    try {
      const barcodes = await detectorRef.current.detect(
        videoRef.current
      );

      if (barcodes.length > 0) {
        const detected = barcodes[0].rawValue || '';

        stopCamera();

        setBarcode(detected);

        lookupBarcode(detected);

        return;
      }
    } catch (err) {
      console.error(err);
    }

    animFrameRef.current = requestAnimationFrame(scanFrame);
  }, [lookupBarcode, stopCamera]);

  const startCamera = useCallback(async () => {
    setCameraError('');

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
          },
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play();
      }

      detectorRef.current = new BarcodeDetector({
        formats: [
          'ean_13',
          'ean_8',
          'upc_a',
          'upc_e',
          'code_128',
          'code_39',
          'qr_code',
        ],
      });

      setScanning(true);

      scanFrame();
    } catch (err) {
      console.error(err);

      setCameraError(
        'Camera access denied or barcode scanner unsupported.'
      );
    }
  }, [scanFrame]);

  useEffect(() => {
    if (mode === 'camera' && !scanning) {
      startCamera();
    }
  }, [mode, scanning, startCamera]);

  function handleManualSearch(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (barcode.trim()) {
      lookupBarcode(barcode.trim());
    }
  }

  function handleAddToCart() {
    if (!product) return;

    onAddToCart(product);

    setAddedFeedback(true);

    setTimeout(() => {
      setAddedFeedback(false);
    }, 2000);
  }

  const sampleProducts = getSampleProducts(storeId);

  const daysUntilExpiry = product
    ? getDaysUntilExpiry(product.expiry_date)
    : null;

  const inCart = product
    ? cartProductIds.includes(product.id)
    : false;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-slate-800 text-xl font-bold">
          Scan Products
        </h2>

        <p className="text-slate-500 text-sm">
          Use camera or enter barcode manually
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setMode('camera');
            setProduct(null);
            setNotFound(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'camera'
              ? 'bg-emerald-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          <Camera size={16} />
          Camera Scan
        </button>

        <button
          onClick={() => {
            setMode('manual');
            stopCamera();
            setProduct(null);
            setNotFound(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'manual'
              ? 'bg-emerald-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          <Keyboard size={16} />
          Manual Entry
        </button>
      </div>

      {mode === 'camera' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {!scanning ? (
            <div className="p-10 text-center">
              <Camera
                size={40}
                className="mx-auto mb-4 text-emerald-600"
              />

              <h3 className="font-semibold mb-2">
                Ready to Scan
              </h3>

              <p className="text-sm text-slate-500 mb-4">
                Point your camera at barcode
              </p>

              {cameraError && (
                <p className="text-red-600 text-sm mb-4">
                  {cameraError}
                </p>
              )}

              <button
                onClick={startCamera}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg"
              >
                Start Camera
              </button>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full max-h-72 object-cover bg-black"
                playsInline
                muted
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-emerald-400 rounded-lg w-48 h-28 animate-pulse" />
              </div>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                  onClick={stopCamera}
                  className="bg-black/60 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2"
                >
                  <CameraOff size={14} />
                  Stop
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'manual' && (
        <form
          onSubmit={handleManualSearch}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <ScanLine
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Enter barcode"
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
          >
            <Search size={16} />
            Lookup
          </button>
        </form>
      )}

      {notFound && (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center">
          <Package
            className="mx-auto text-slate-300 mb-2"
            size={36}
          />

          <p className="font-medium text-slate-600">
            Product not found
          </p>
        </div>
      )}

      {product && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3">
            <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
              <ScanLine size={16} />
              Product Found
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">
                  {product.name}
                </h3>

                {product.category && (
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                )}
              </div>

              <p className="text-emerald-600 font-bold text-2xl">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            {product.description && (
              <p className="text-slate-500 text-sm mb-4">
                {product.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">
                  Barcode
                </p>

                <p className="font-mono text-sm">
                  {product.barcode}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">
                  Stock
                </p>

                <p className="text-sm font-medium">
                  {product.stock_quantity} units
                </p>
              </div>

              {product.expiry_date && (
                <div
                  className={`rounded-lg p-3 ${
                    daysUntilExpiry !== null &&
                    daysUntilExpiry <= 7
                      ? 'bg-amber-50'
                      : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs mb-1">
                    {daysUntilExpiry !== null &&
                    daysUntilExpiry <= 7 ? (
                      <AlertTriangle size={11} />
                    ) : (
                      <Calendar size={11} />
                    )}

                    Expires
                  </div>

                  <p className="text-sm font-medium">
                    {product.expiry_date}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 ${
                addedFeedback
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {addedFeedback ? (
                <>
                  <CheckCircle2 size={18} />
                  Added to Cart!
                </>
              ) : (
                <>
                  <Plus size={18} />
                  {inCart ? 'Add Again' : 'Add to Cart'}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="bg-slate-100 rounded-xl p-4">
        <div className="mb-2">
          <p className="text-xs font-medium text-slate-500">
            Sample barcodes for the selected store
          </p>
          <p className="text-xs text-slate-500">
            Only barcodes for store ID {storeId} are shown here.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {sampleProducts.slice(0, 3).map((item) => (
              <button
                key={item.barcode}
                onClick={() => {
                  setBarcode(item.barcode);
                  lookupBarcode(item.barcode);
                  setMode('manual');
                }}
                className="bg-white border border-slate-200 hover:border-emerald-400 text-xs font-mono px-3 py-1.5 rounded-lg"
              >
                {item.barcode}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}